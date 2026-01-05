/**
 * SEO/AEO Generator
 * Generates sitemaps, RSS feeds, structured data, etc.
 */

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  author?: string;
  category?: string[];
}

export class SEOGenerator {
  /**
   * Generate XML sitemap
   */
  static generateSitemap(entries: SitemapEntry[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    return xml;
  }

  /**
   * Generate RSS feed
   */
  static generateRSS(
    siteTitle: string,
    siteUrl: string,
    siteDescription: string,
    items: RSSItem[]
  ): string {
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${this.escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${this.escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items.map(item => `    <item>
      <title>${this.escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${this.escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
${item.author ? `      <author>${this.escapeXml(item.author)}</author>` : ''}
${item.category?.map(cat => `      <category>${this.escapeXml(cat)}</category>`).join('\n') || ''}
    </item>`).join('\n')}
  </channel>
</rss>`;
    return rss;
  }

  /**
   * Generate JSON-LD structured data for Article
   */
  static generateArticleSchema(article: any, siteUrl: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt || article.metaDescription,
      image: article.featuredImage ? `${siteUrl}${article.featuredImage}` : undefined,
      datePublished: article.publishedAt?.toISOString(),
      dateModified: article.updatedAt?.toISOString(),
      author: {
        '@type': 'Person',
        name: article.author?.name || 'Unknown',
        url: article.author?.website,
      },
      publisher: {
        '@type': 'Organization',
        name: process.env['BLOG_NAME'] || 'Blog',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/post/${article.slug}`,
      },
    };
  }

  /**
   * Generate JSON-LD structured data for Website
   */
  static generateWebsiteSchema(siteUrl: string, siteName: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  /**
   * Generate JSON-LD structured data for Organization
   */
  static generateOrganizationSchema(org: any, siteUrl: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: org.name,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: org.socialLinks || [],
      contactPoint: {
        '@type': 'ContactPoint',
        email: org.email,
        contactType: 'customer service',
      },
    };
  }

  /**
   * Generate JSON-LD structured data for BreadcrumbList
   */
  static generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  /**
   * Generate robots.txt
   */
  static generateRobotsTxt(siteUrl: string, disallowPaths: string[] = []): string {
    const disallows = disallowPaths.map(path => `Disallow: ${path}`).join('\n');
    return `User-agent: *
${disallows || 'Allow: /'}

Sitemap: ${siteUrl}/sitemap.xml`;
  }

  /**
   * Escape XML special characters
   */
  private static escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
