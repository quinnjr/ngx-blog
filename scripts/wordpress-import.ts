#!/usr/bin/env node
/**
 * WordPress to NGX Blog Import Script
 *
 * Usage: node --loader ts-node/esm scripts/wordpress-import.ts path/to/ngx-blog-export.json
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

interface WordPressExport {
  version: string;
  exported_at: string;
  wordpress_version: string;
  settings: Record<string, any>;
  authors: any[];
  categories: any[];
  tags: any[];
  posts: any[];
  pages: any[];
  comments: any[];
}

async function importWordPress(exportPath: string) {
  console.log('🚀 Starting WordPress import...\n');

  // Read export file
  const data: WordPressExport = JSON.parse(readFileSync(resolve(exportPath), 'utf-8'));

  console.log(`📦 Import file info:`);
  console.log(`   WordPress version: ${data.wordpress_version}`);
  console.log(`   Exported: ${data.exported_at}\n`);

  try {
    // Import settings
    console.log('⚙️  Importing settings...');
    for (const [key, value] of Object.entries(data.settings)) {
      if (value) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(value), updatedAt: new Date() },
          create: {
            key,
            value: String(value),
            type: typeof value === 'number' ? 'number' : 'text',
            autoload: true,
          },
        });
      }
    }
    console.log(`   ✓ Imported ${Object.keys(data.settings).length} settings\n`);

    // Import authors
    console.log('👤 Importing authors...');
    const authorMap = new Map<number, string>();
    for (const wpAuthor of data.authors) {
      const author = await prisma.author.upsert({
        where: { email: wpAuthor.email },
        update: {
          name: wpAuthor.name,
          bio: wpAuthor.bio || null,
          avatar: wpAuthor.avatar || null,
          twitter: wpAuthor.twitter || null,
          linkedin: wpAuthor.linkedin || null,
          github: wpAuthor.github || null,
          website: wpAuthor.website || null,
        },
        create: {
          name: wpAuthor.name,
          email: wpAuthor.email,
          bio: wpAuthor.bio || null,
          avatar: wpAuthor.avatar || null,
          twitter: wpAuthor.twitter || null,
          linkedin: wpAuthor.linkedin || null,
          github: wpAuthor.github || null,
          website: wpAuthor.website || null,
        },
      });
      authorMap.set(wpAuthor.id, author.id);
    }
    console.log(`   ✓ Imported ${data.authors.length} authors\n`);

    // Import categories
    console.log('📁 Importing categories...');
    const categoryMap = new Map<string, string>();
    for (const wpCat of data.categories) {
      const category = await prisma.category.upsert({
        where: { slug: wpCat.slug },
        update: {
          name: wpCat.name,
          description: wpCat.description || null,
        },
        create: {
          name: wpCat.name,
          slug: wpCat.slug,
          description: wpCat.description || null,
        },
      });
      categoryMap.set(wpCat.slug, category.id);
    }
    console.log(`   ✓ Imported ${data.categories.length} categories\n`);

    // Import tags
    console.log('🏷️  Importing tags...');
    const tagMap = new Map<string, string>();
    for (const wpTag of data.tags) {
      const tag = await prisma.tag.upsert({
        where: { slug: wpTag.slug },
        update: {
          name: wpTag.name,
        },
        create: {
          name: wpTag.name,
          slug: wpTag.slug,
        },
      });
      tagMap.set(wpTag.slug, tag.id);
    }
    console.log(`   ✓ Imported ${data.tags.length} tags\n`);

    // Import posts
    console.log('📝 Importing posts...');
    const postMap = new Map<number, string>();
    for (const wpPost of data.posts) {
      const authorId = authorMap.get(wpPost.author_id);
      if (!authorId) {
        console.warn(`   ⚠️  Skipping post "${wpPost.title}" - author not found`);
        continue;
      }

      // Get category IDs
      const categoryIds = wpPost.categories
        .map((slug: string) => categoryMap.get(slug))
        .filter(Boolean);

      // Get tag IDs
      const tagIds = wpPost.tags
        .map((slug: string) => tagMap.get(slug))
        .filter(Boolean);

      const post = await prisma.post.create({
        data: {
          title: wpPost.title,
          slug: wpPost.slug,
          content: wpPost.content,
          excerpt: wpPost.excerpt,
          featuredImage: wpPost.featured_image,
          status: wpPost.status,
          authorId,
          publishedAt: wpPost.published_at ? new Date(wpPost.published_at) : null,
          createdAt: new Date(wpPost.created_at),
          updatedAt: new Date(wpPost.updated_at),
          metaTitle: wpPost.seo?.metaTitle,
          metaDescription: wpPost.seo?.metaDescription,
          categories: {
            connect: categoryIds.map(id => ({ id })),
          },
          tags: {
            connect: tagIds.map(id => ({ id })),
          },
        },
      });
      postMap.set(wpPost.id, post.id);
    }
    console.log(`   ✓ Imported ${data.posts.length} posts\n`);

    // Import pages
    console.log('📄 Importing pages...');
    for (const wpPage of data.pages) {
      await prisma.page.create({
        data: {
          title: wpPage.title,
          slug: wpPage.slug,
          content: wpPage.content,
          status: wpPage.status,
          template: wpPage.template || 'DEFAULT',
          order: wpPage.order || 0,
          createdAt: new Date(wpPage.created_at),
          updatedAt: new Date(wpPage.updated_at),
        },
      });
    }
    console.log(`   ✓ Imported ${data.pages.length} pages\n`);

    // Import comments
    console.log('💬 Importing comments...');
    let importedComments = 0;
    for (const wpComment of data.comments) {
      const postId = postMap.get(wpComment.post_id);
      if (!postId) continue;

      await prisma.comment.create({
        data: {
          postId,
          author: wpComment.author,
          email: wpComment.email,
          content: wpComment.content,
          approved: wpComment.approved,
          createdAt: new Date(wpComment.created_at),
        },
      });
      importedComments++;
    }
    console.log(`   ✓ Imported ${importedComments} comments\n`);

    console.log('✅ Import complete!\n');
    console.log('Summary:');
    console.log(`   Settings:   ${Object.keys(data.settings).length}`);
    console.log(`   Authors:    ${data.authors.length}`);
    console.log(`   Categories: ${data.categories.length}`);
    console.log(`   Tags:       ${data.tags.length}`);
    console.log(`   Posts:      ${data.posts.length}`);
    console.log(`   Pages:      ${data.pages.length}`);
    console.log(`   Comments:   ${importedComments}`);

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run
const exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/wordpress-import.js <path-to-export.json>');
  process.exit(1);
}

importWordPress(exportPath);
