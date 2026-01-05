import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { SEOGenerator } from './lib/seo-generator';
import { Cache } from './lib/cache';
import { SettingsLoader } from './lib/settings-loader';
import { get_option, get_site_url, get_bloginfo } from './lib/wp-functions';
import { Security, requireAuth, requireAdmin, checkSqlInjection, AuditLog } from './lib/security';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Security headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Angular needs eval
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS
app.use(cors({
  origin: process.env['ALLOWED_ORIGINS']?.split(',') || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many login attempts',
});

app.use('/api/', limiter);

// Parse JSON bodies (with size limit)
app.use(express.json({ limit: '10mb' }));

// SQL injection check on all API routes
app.use('/api/', checkSqlInjection);

// Settings will be loaded from database
let settingsInitialized = false;

// Lazy load Prisma only when needed (not during build)
let prismaInstance: any = null;
let disconnectFn: any = null;

async function getPrisma() {
  if (!prismaInstance) {
    const { prisma, disconnectPrisma } = await import('./lib/prisma');
    prismaInstance = prisma;
    disconnectFn = disconnectPrisma;

    // Load settings from database on first Prisma access
    if (!settingsInitialized) {
      try {
        await SettingsLoader.load(prisma);
        settingsInitialized = true;
      } catch (error) {
        console.error('Failed to initialize settings:', error);
      }
    }
  }
  return prismaInstance;
}

async function disconnect() {
  if (disconnectFn) {
    await disconnectFn();
  }
}

// Helper to get site configuration from settings (WordPress-style)
function getSiteConfig() {
  const port = process.env['PORT'] || 4000;
  return {
    // Using WordPress-compatible function names
    url: get_option('site_url', `http://localhost:${port}`),
    name: get_option('blogname', 'My Blog'),
    description: get_option('blogdescription', 'A blog powered by NGX Blog CMS'),
    postsPerPage: get_option('posts_per_page', 10),
    rssPostsCount: get_option('posts_per_rss', 20),
    commentsEnabled: get_option('default_comment_status', true),
    sitemapEnabled: get_option('sitemap_enabled', true),
    rssEnabled: get_option('rss_enabled', true),
  };
}

/**
 * API Routes
 */

// Posts API
app.get('/api/posts', async (req, res) => {
  try {
    const db = await getPrisma();
    const posts = await db.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:slug', async (req, res) => {
  try {
    const db = await getPrisma();
    const post = await db.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: true,
        categories: true,
        tags: true,
        comments: {
          where: { approved: true },
          include: { replies: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views
    await db.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Pages API
app.get('/api/pages', async (req, res) => {
  try {
    const db = await getPrisma();
    const pages = await db.page.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
    return res.json(pages);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

app.get('/api/pages/:slug', async (req, res) => {
  try {
    const db = await getPrisma();
    const page = await db.page.findUnique({
      where: { slug: req.params.slug },
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    return res.json(page);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const db = await getPrisma();
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Tags API
app.get('/api/tags', async (req, res) => {
  try {
    const db = await getPrisma();
    const tags = await db.tag.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json(tags);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const db = await getPrisma();
    const settings = await db.setting.findMany();
    const settingsObj = settings.reduce((acc: Record<string, any>, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
    return res.json(settingsObj);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Themes API
app.get('/api/themes', async (req, res) => {
  try {
    const db = await getPrisma();
    const themes = await db.theme.findMany();
    return res.json(themes);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch themes' });
  }
});

app.get('/api/themes/active', async (req, res) => {
  try {
    const db = await getPrisma();
    const theme = await db.theme.findFirst({
      where: { active: true },
    });
    return res.json(theme);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch active theme' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const db = await getPrisma();
    await db.$queryRaw`SELECT 1`;
    return res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    return res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// ============================================================================
// SEO/AEO ENDPOINTS
// ============================================================================

// Sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const db = await getPrisma();
    const config = getSiteConfig();

    if (!config.sitemapEnabled) {
      return res.status(404).send('Sitemap is disabled');
    }

    // Check cache
    const cached = Cache.get<string>('sitemap');
    if (cached) {
      res.header('Content-Type', 'application/xml');
      return res.send(cached);
    }

    // Get all published posts
    const posts = await db.post.findMany({
      where: { status: 'PUBLISHED', visibility: 'PUBLIC' },
      select: { slug: true, updatedAt: true },
    });

    // Get all published pages
    const pages = await db.page.findMany({
      where: { status: 'PUBLISHED', visibility: 'PUBLIC' },
      select: { slug: true, updatedAt: true },
    });

    const entries: any[] = [
      // Homepage
      {
        url: config.url,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 1.0,
      },
      // Posts
      ...posts.map((post: any) => ({
        url: `${config.url}/post/${post.slug}`,
        lastmod: post.updatedAt.toISOString().split('T')[0],
        changefreq: 'weekly' as const,
        priority: 0.8,
      })),
      // Pages
      ...pages.map((page: any) => ({
        url: `${config.url}/page/${page.slug}`,
        lastmod: page.updatedAt.toISOString().split('T')[0],
        changefreq: 'monthly' as const,
        priority: 0.6,
      })),
    ];

    const sitemap = SEOGenerator.generateSitemap(entries);

    // Cache for 1 hour
    Cache.set('sitemap', sitemap, 3600000);

    res.header('Content-Type', 'application/xml');
    return res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return res.status(500).send('Error generating sitemap');
  }
});

// RSS Feed
app.get('/rss.xml', async (req, res) => {
  try {
    const db = await getPrisma();
    const config = getSiteConfig();

    if (!config.rssEnabled) {
      return res.status(404).send('RSS feed is disabled');
    }

    // Check cache
    const cached = Cache.get<string>('rss');
    if (cached) {
      res.header('Content-Type', 'application/xml');
      return res.send(cached);
    }

    const posts = await db.post.findMany({
      where: { status: 'PUBLISHED', visibility: 'PUBLIC' },
      include: { author: true, categories: true },
      orderBy: { publishedAt: 'desc' },
      take: config.rssPostsCount,
    });

    const items = posts.map((post: any) => ({
      title: post.title,
      link: `${config.url}/post/${post.slug}`,
      description: post.excerpt || '',
      pubDate: post.publishedAt?.toUTCString() || new Date().toUTCString(),
      guid: `${config.url}/post/${post.slug}`,
      author: post.author?.email,
      category: post.categories.map((c: any) => c.name),
    }));

    const rss = SEOGenerator.generateRSS(config.name, config.url, config.description, items);

    // Cache for 30 minutes
    Cache.set('rss', rss, 1800000);

    res.header('Content-Type', 'application/xml');
    return res.send(rss);
  } catch (error) {
    console.error('RSS generation error:', error);
    return res.status(500).send('Error generating RSS feed');
  }
});

// Robots.txt
app.get('/robots.txt', async (req, res) => {
  const db = await getPrisma();
  const config = getSiteConfig();
  const disallowPaths = ['/admin', '/api'];
  const robotsTxt = SEOGenerator.generateRobotsTxt(config.url, disallowPaths);
  res.header('Content-Type', 'text/plain');
  return res.send(robotsTxt);
});

// Structured Data API
app.get('/api/seo/structured-data/post/:slug', async (req, res) => {
  try {
    const db = await getPrisma();
    const config = getSiteConfig();
    const post = await db.post.findUnique({
      where: { slug: req.params.slug },
      include: { author: true },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const schema = SEOGenerator.generateArticleSchema(post, config.url);
    return res.json(schema);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate structured data' });
  }
});

// Website schema
app.get('/api/seo/structured-data/website', async (req, res) => {
  const db = await getPrisma();
  const config = getSiteConfig();
  const schema = SEOGenerator.generateWebsiteSchema(config.url, config.name);
  return res.json(schema);
});

// ============================================================================
// SETTINGS ENDPOINTS
// ============================================================================

// Get all settings (grouped by category)
app.get('/api/settings', async (req, res) => {
  try {
    const db = await getPrisma();
    const settings = await db.setting.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    });

    // Group by category
    const grouped: Record<string, any[]> = {};
    for (const setting of settings) {
      if (!grouped[setting.category]) {
        grouped[setting.category] = [];
      }
      grouped[setting.category].push({
        key: setting.key,
        value: SettingsLoader.parseValue(setting.value, setting.type),
        label: setting.label,
        description: setting.description,
        type: setting.type,
      });
    }

    return res.json(grouped);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Login endpoint
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = Security.getClientIp(req);

    if (Security.isLockedOut(ip)) {
      AuditLog.log(ip, 'login_attempt_locked_out', email);
      return res.status(429).json({ error: 'Too many failed attempts. Try again later.' });
    }

    const db = await getPrisma();
    const author = await db.author.findUnique({ where: { email } });

    if (!author) {
      Security.recordFailedLogin(ip);
      AuditLog.log(ip, 'login_failed_no_user', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // TODO: Add password field to Author model and check it here
    // For now, just generate token
    Security.resetLoginAttempts(ip);

    const token = Security.generateToken({
      id: author.id,
      email: author.email,
      role: 'admin', // TODO: Add role field to Author model
    });

    AuditLog.log(ip, 'login_success', email);

    return res.json({ token, user: { id: author.id, email: author.email, name: author.name } });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const db = await getPrisma();
    const author = await db.author.findUnique({ where: { id: user.id } });

    if (!author) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ id: author.id, email: author.email, name: author.name });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update settings (PROTECTED)
app.put('/api/settings', requireAuth, requireAdmin, async (req, res) => {
  try {
    const db = await getPrisma();
    const updates = req.body;

    // Update or create each setting
    for (const [key, value] of Object.entries(updates)) {
      const existing = await db.setting.findUnique({ where: { key } });
      const type = existing?.type || 'text';
      const serialized = SettingsLoader.serializeValue(value, type);

      await db.setting.upsert({
        where: { key },
        update: { value: serialized, updatedAt: new Date() },
        create: { key, value: serialized, type },
      });

      // Update cache
      SettingsLoader.update(key, value);
    }

    // Clear sitemap/RSS cache on settings update
    Cache.delete('sitemap');
    Cache.delete('rss');

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get specific setting
app.get('/api/settings/:key', async (req, res) => {
  try {
    const db = await getPrisma();
    const setting = await db.setting.findUnique({
      where: { key: req.params.key },
    });

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    return res.json({
      key: setting.key,
      value: SettingsLoader.parseValue(setting.value, setting.type)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// Delete specific setting (PROTECTED)
app.delete('/api/settings/:key', requireAuth, requireAdmin, async (req, res) => {
  try {
    const db = await getPrisma();
    await db.setting.delete({
      where: { key: req.params.key },
    });

    // Update cache
    SettingsLoader.delete(req.params.key);

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete setting' });
  }
});

// ============================================================================
// WORDPRESS-COMPATIBLE OPTION API
// ============================================================================

// WordPress-style: get_option
app.get('/wp-json/options/:option', async (req, res) => {
  try {
    const value = SettingsLoader.get_option(req.params.option);
    if (value === undefined) {
      return res.status(404).json({ error: 'Option not found' });
    }
    return res.json({ option: req.params.option, value });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get option' });
  }
});

// WordPress-style: update_option (PROTECTED)
app.post('/wp-json/options/:option', requireAuth, requireAdmin, async (req, res) => {
  try {
    const db = await getPrisma();
    const { value } = req.body;
    const option = req.params.option;

    const existing = await db.setting.findUnique({ where: { key: option } });
    const type = existing?.type || 'text';
    const serialized = SettingsLoader.serializeValue(value, type);

    await db.setting.upsert({
      where: { key: option },
      update: { value: serialized, updatedAt: new Date() },
      create: { key: option, value: serialized, type },
    });

    SettingsLoader.update_option(option, value);

    return res.json({ success: true, option, value });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update option' });
  }
});

// WordPress-style: delete_option (PROTECTED)
app.delete('/wp-json/options/:option', requireAuth, requireAdmin, async (req, res) => {
  try {
    const db = await getPrisma();
    await db.setting.delete({
      where: { key: req.params.option },
    });

    SettingsLoader.delete_option(req.params.option);

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete option' });
  }
});

// ============================================================================
// ANALYTICS ENDPOINTS
// ============================================================================

// Get post analytics
app.get('/api/analytics/posts', async (req, res) => {
  try {
    const db = await getPrisma();

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      popularPosts,
    ] = await Promise.all([
      db.post.count(),
      db.post.count({ where: { status: 'PUBLISHED' } }),
      db.post.count({ where: { status: 'DRAFT' } }),
      db.post.aggregate({ _sum: { views: true } }),
      db.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { views: 'desc' },
        take: 10,
        select: { id: true, title: true, slug: true, views: true, publishedAt: true },
      }),
    ]);

    return res.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: totalViews._sum.views || 0,
      popularPosts,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Increment post views
app.post('/api/analytics/posts/:id/view', async (req, res) => {
  try {
    const db = await getPrisma();
    await db.post.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } },
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to increment views' });
  }
});

// Get dashboard stats
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const db = await getPrisma();

    const [
      postsCount,
      pagesCount,
      categoriesCount,
      commentsCount,
      recentPosts,
      recentComments,
    ] = await Promise.all([
      db.post.count({ where: { status: 'PUBLISHED' } }),
      db.page.count({ where: { status: 'PUBLISHED' } }),
      db.category.count(),
      db.comment.count({ where: { approved: true } }),
      db.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true,
          views: true,
        },
      }),
      db.comment.findMany({
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { author: { select: { name: true } } },
      }),
    ]);

    return res.json({
      stats: {
        posts: postsCount,
        pages: pagesCount,
        categories: categoriesCount,
        comments: commentsCount,
      },
      recentPosts,
      recentComments,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// ============================================================================
// COMMENTS ENDPOINTS
// ============================================================================

// Get comments for a post
app.get('/api/posts/:slug/comments', async (req, res) => {
  try {
    const db = await getPrisma();

    const post = await db.post.findUnique({
      where: { slug: req.params.slug },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = await db.comment.findMany({
      where: {
        postId: post.id,
        approved: true,
        parentId: null, // Top-level comments only
      },
      include: {
        author: true,
        replies: {
          where: { approved: true },
          include: { author: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create comment
app.post('/api/posts/:slug/comments', async (req, res) => {
  try {
    const db = await getPrisma();
    const { content, authorId, parentId } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = await db.post.findUnique({
      where: { slug: req.params.slug },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await db.comment.create({
      data: {
        content,
        postId: post.id,
        authorId: authorId || null,
        parentId: parentId || null,
        approved: false, // Require moderation
      },
      include: { author: true },
    });

    return res.json(comment);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Approve comment (PROTECTED - admin only)
app.post('/api/comments/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const db = await getPrisma();
    const comment = await db.comment.update({
      where: { id: req.params.id },
      data: { approved: true },
    });
    return res.json(comment);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to approve comment' });
  }
});

// Delete comment (PROTECTED - admin only)
app.delete('/api/comments/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const db = await getPrisma();
    await db.comment.delete({
      where: { id: req.params.id },
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// ============================================================================
// SEARCH ENDPOINT
// ============================================================================

// Search posts
app.get('/api/search', async (req, res) => {
  try {
    const { q, category, tag, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const db = await getPrisma();

    const posts = await db.post.findMany({
      where: {
        AND: [
          { status: 'PUBLISHED' },
          { visibility: 'PUBLIC' },
          {
            OR: [
              { title: { contains: String(q), mode: 'insensitive' } },
              { content: { contains: String(q), mode: 'insensitive' } },
              { excerpt: { contains: String(q), mode: 'insensitive' } },
            ],
          },
          category ? {
            categories: {
              some: { slug: String(category) },
            },
          } : {},
          tag ? {
            tags: {
              some: { slug: String(tag) },
            },
          } : {},
        ],
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
      take: Number(limit),
      orderBy: { publishedAt: 'desc' },
    });

    return res.json({
      query: q,
      results: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
});

// Plugins API
app.get('/api/plugins', async (req, res) => {
  try {
    const db = await getPrisma();
    const plugins = await db.plugin.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json(plugins);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch plugins' });
  }
});

app.post('/api/plugins/:id/enable', async (req, res) => {
  try {
    const db = await getPrisma();
    const plugin = await db.plugin.update({
      where: { id: req.params.id },
      data: { enabled: true, updatedAt: new Date() },
    });
    return res.json(plugin);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to enable plugin' });
  }
});

app.post('/api/plugins/:id/disable', async (req, res) => {
  try {
    const db = await getPrisma();
    const plugin = await db.plugin.update({
      where: { id: req.params.id },
      data: { enabled: false, updatedAt: new Date() },
    });
    return res.json(plugin);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to disable plugin' });
  }
});

app.put('/api/plugins/:id/settings', async (req, res) => {
  try {
    const db = await getPrisma();
    const plugin = await db.plugin.update({
      where: { id: req.params.id },
      data: { settings: req.body, updatedAt: new Date() },
    });
    return res.json(plugin);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update plugin settings' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  const server = app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
    console.log(`Database: ${process.env['DATABASE_URL'] ? 'Connected' : 'Not configured'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
      console.log('HTTP server closed');
      await disconnect();
      process.exit(0);
    });
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(async () => {
      console.log('HTTP server closed');
      await disconnect();
      process.exit(0);
    });
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
