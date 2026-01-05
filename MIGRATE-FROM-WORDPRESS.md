# Migrate from WordPress to NGX Blog

## Quick Start

### Step 1: Export from WordPress

1. Copy `scripts/wordpress-export.php` to your WordPress root directory
2. Run the export:
   ```bash
   php wordpress-export.php
   ```
3. This creates `ngx-blog-export.json` with all your content

### Step 2: Setup NGX Blog

1. Configure database in `.env.local`:

   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
   JWT_SECRET="your-secret-key"
   ```

2. Run migrations:
   ```bash
   pnpm prisma migrate deploy
   ```

### Step 3: Import to NGX Blog

```bash
pnpm migrate:import /path/to/ngx-blog-export.json
```

Done! Your WordPress content is now in NGX Blog.

## What Gets Migrated

✅ **Settings** (19 options)

- Site title, description, URL
- Posts per page, RSS settings
- Comment settings
- Theme settings

✅ **Authors** (with profiles)

- Name, email, bio
- Avatar, social links
- All users with author/editor/admin roles

✅ **Categories** (with hierarchy)

- Name, slug, description
- Parent-child relationships

✅ **Tags**

- Name, slug

✅ **Posts** (all content)

- Title, slug, content, excerpt
- Featured images
- Status (published/draft/scheduled)
- Author, categories, tags
- Publish dates
- SEO metadata (Yoast compatible)

✅ **Pages**

- Title, slug, content
- Status, template
- Parent-child relationships
- Menu order

✅ **Comments**

- Author, email, content
- Approval status
- Parent-child relationships (nested comments)

## Export Details

### Posts

- **Status mapping:**
  - `publish` → `PUBLISHED`
  - `draft` → `DRAFT`
  - `future` → `SCHEDULED`
  - All other → `DRAFT`

### SEO Data

- Extracts Yoast SEO metadata if installed
- Falls back to post title/excerpt if no SEO data

### Images

- Featured images are migrated via URL
- Content images remain linked to WordPress (update manually or use search-replace)

### Comments

- Maintains parent-child relationships
- Preserves approval status
- Only migrates comments for migrated posts

## Advanced Usage

### Export Only Specific Post Types

Edit `wordpress-export.php`:

```php
$wp_posts = get_posts([
    'post_type' => 'post',
    'post_status' => ['publish'],  // Only published
    'numberposts' => 100,          // Limit to 100
]);
```

### Dry Run

Check export file before importing:

```bash
cat ngx-blog-export.json | jq '.posts | length'  # Count posts
cat ngx-blog-export.json | jq '.authors'         # View authors
```

### Import Issues

If import fails midway, clear the database:

```bash
pnpm prisma migrate reset
pnpm prisma migrate deploy
```

Then re-run import.

## Post-Migration Tasks

### 1. Update Image URLs

If keeping WordPress for images:

- No action needed, images will load from old site

If moving images:

```bash
# Download WordPress uploads
wget -r -np -nH --cut-dirs=2 https://oldsite.com/wp-content/uploads/

# Update database
psql $DATABASE_URL -c "UPDATE posts SET content = replace(content, 'oldsite.com', 'newsite.com');"
```

### 2. Update Internal Links

```sql
UPDATE posts SET content = replace(content, 'https://oldsite.com', 'https://newsite.com');
UPDATE pages SET content = replace(content, 'https://oldsite.com', 'https://newsite.com');
```

### 3. Set Up Redirects

In your old WordPress `.htaccess`:

```apache
# Redirect posts
RedirectMatch 301 ^/(.*)$ https://newsite.com/$1

# Or specific redirects
Redirect 301 /2024/01/my-post https://newsite.com/post/my-post
```

### 4. Test Everything

- [ ] Visit migrated posts
- [ ] Check images load
- [ ] Test categories/tags
- [ ] Verify comments
- [ ] Check author pages
- [ ] Test search

### 5. Update DNS

Once verified, point your domain to NGX Blog server.

## Troubleshooting

### Export file too large

Split into chunks:

```php
// In wordpress-export.php
$posts = get_posts([
    'offset' => 0,
    'numberposts' => 100,
]);
```

Run multiple times with different offsets.

### Import fails on specific post

Check export file for that post:

```bash
cat ngx-blog-export.json | jq '.posts[] | select(.id == 123)'
```

Remove problematic post and import again.

### Missing authors

Manually create authors in NGX Blog before importing:

```bash
# In Prisma Studio
pnpm prisma studio
```

### Database conflicts

If posts/pages already exist with same slug:

```sql
-- View conflicts
SELECT slug, COUNT(*) FROM posts GROUP BY slug HAVING COUNT(*) > 1;

-- Delete test data
DELETE FROM posts WHERE title LIKE 'Test%';
```

## Performance

- **Small site** (<100 posts): ~10 seconds
- **Medium site** (100-1000 posts): ~1-2 minutes
- **Large site** (1000+ posts): ~5-10 minutes

Database size will be ~60% smaller than WordPress (no post revisions, efficient schema).

## Rollback

If you need to go back to WordPress:

1. Keep WordPress database backup
2. Restore WordPress database
3. WordPress site returns immediately

NGX Blog migration is non-destructive to WordPress.

## Support

Issues? Check:

1. PHP version >= 7.4
2. WordPress loaded correctly
3. Database credentials correct
4. Prisma migrations run
5. Export file is valid JSON

## Next Steps

After migration:

1. Configure NGX Blog settings via `/admin/settings`
2. Set up SSL certificate
3. Configure caching
4. Set up backups
5. Add new features not in WordPress!
