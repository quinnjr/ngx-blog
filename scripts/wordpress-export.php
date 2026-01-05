<?php
/**
 * WordPress to NGX Blog Export Script
 *
 * Usage: Place in WordPress root and run: php wordpress-export.php
 * Creates: ngx-blog-export.json
 */

// Load WordPress
require_once('wp-load.php');

if (!defined('ABSPATH')) {
    die('WordPress not found. Place this file in WordPress root directory.');
}

echo "Starting WordPress export...\n\n";

// Export settings
echo "Exporting settings...\n";
$settings = [
    'blogname' => get_option('blogname'),
    'blogdescription' => get_option('blogdescription'),
    'siteurl' => get_option('siteurl'),
    'home' => get_option('home'),
    'admin_email' => get_option('admin_email'),
    'WPLANG' => get_option('WPLANG'),
    'timezone_string' => get_option('timezone_string'),
    'posts_per_page' => get_option('posts_per_page'),
    'posts_per_rss' => get_option('posts_per_rss'),
    'show_on_front' => get_option('show_on_front'),
    'default_comment_status' => get_option('default_comment_status'),
    'comment_moderation' => get_option('comment_moderation'),
    'comment_registration' => get_option('comment_registration'),
    'close_comments_for_old_posts' => get_option('close_comments_for_old_posts'),
    'close_comments_days_old' => get_option('close_comments_days_old'),
    'thread_comments' => get_option('thread_comments'),
    'thread_comments_depth' => get_option('thread_comments_depth'),
    'template' => get_option('template'),
    'stylesheet' => get_option('stylesheet'),
];

// Export authors
echo "Exporting authors...\n";
$authors = [];
$wp_authors = get_users(['role__in' => ['administrator', 'editor', 'author']]);
foreach ($wp_authors as $user) {
    $authors[] = [
        'id' => $user->ID,
        'name' => $user->display_name,
        'email' => $user->user_email,
        'bio' => get_user_meta($user->ID, 'description', true),
        'avatar' => get_avatar_url($user->ID),
        'twitter' => get_user_meta($user->ID, 'twitter', true),
        'linkedin' => get_user_meta($user->ID, 'linkedin', true),
        'github' => get_user_meta($user->ID, 'github', true),
        'website' => $user->user_url,
    ];
}
echo "Exported " . count($authors) . " authors\n";

// Export categories
echo "Exporting categories...\n";
$categories = [];
$wp_categories = get_categories(['hide_empty' => false]);
foreach ($wp_categories as $cat) {
    $categories[] = [
        'id' => $cat->term_id,
        'name' => $cat->name,
        'slug' => $cat->slug,
        'description' => $cat->description,
        'parent_id' => $cat->parent ?: null,
    ];
}
echo "Exported " . count($categories) . " categories\n";

// Export tags
echo "Exporting tags...\n";
$tags = [];
$wp_tags = get_tags(['hide_empty' => false]);
foreach ($wp_tags as $tag) {
    $tags[] = [
        'id' => $tag->term_id,
        'name' => $tag->name,
        'slug' => $tag->slug,
    ];
}
echo "Exported " . count($tags) . " tags\n";

// Export posts
echo "Exporting posts...\n";
$posts = [];
$wp_posts = get_posts([
    'post_type' => 'post',
    'post_status' => ['publish', 'draft', 'pending', 'future'],
    'numberposts' => -1,
]);

foreach ($wp_posts as $post) {
    // Get post categories
    $post_cats = wp_get_post_categories($post->ID);
    $post_cat_names = [];
    foreach ($post_cats as $cat_id) {
        $cat = get_category($cat_id);
        $post_cat_names[] = $cat->slug;
    }

    // Get post tags
    $post_tags = wp_get_post_tags($post->ID);
    $post_tag_names = array_map(function($tag) { return $tag->slug; }, $post_tags);

    // Get SEO data (Yoast)
    $yoast_title = get_post_meta($post->ID, '_yoast_wpseo_title', true);
    $yoast_desc = get_post_meta($post->ID, '_yoast_wpseo_metadesc', true);

    // Map post status
    $status = 'DRAFT';
    if ($post->post_status === 'publish') $status = 'PUBLISHED';
    if ($post->post_status === 'future') $status = 'SCHEDULED';

    $posts[] = [
        'id' => $post->ID,
        'title' => $post->post_title,
        'slug' => $post->post_name,
        'content' => $post->post_content,
        'excerpt' => $post->post_excerpt ?: wp_trim_words($post->post_content, 55),
        'featured_image' => get_the_post_thumbnail_url($post->ID, 'full') ?: null,
        'status' => $status,
        'author_id' => $post->post_author,
        'categories' => $post_cat_names,
        'tags' => $post_tag_names,
        'published_at' => $post->post_status === 'publish' ? $post->post_date : null,
        'created_at' => $post->post_date,
        'updated_at' => $post->post_modified,
        'seo' => [
            'metaTitle' => $yoast_title ?: $post->post_title,
            'metaDescription' => $yoast_desc ?: wp_trim_words($post->post_content, 20),
        ],
    ];
}
echo "Exported " . count($posts) . " posts\n";

// Export pages
echo "Exporting pages...\n";
$pages = [];
$wp_pages = get_posts([
    'post_type' => 'page',
    'post_status' => ['publish', 'draft'],
    'numberposts' => -1,
]);

foreach ($wp_pages as $page) {
    $pages[] = [
        'id' => $page->ID,
        'title' => $page->post_title,
        'slug' => $page->post_name,
        'content' => $page->post_content,
        'status' => $page->post_status === 'publish' ? 'PUBLISHED' : 'DRAFT',
        'template' => get_post_meta($page->ID, '_wp_page_template', true) ?: 'DEFAULT',
        'parent_id' => $page->post_parent ?: null,
        'order' => $page->menu_order,
        'created_at' => $page->post_date,
        'updated_at' => $page->post_modified,
    ];
}
echo "Exported " . count($pages) . " pages\n";

// Export comments
echo "Exporting comments...\n";
$comments = [];
$wp_comments = get_comments(['status' => 'all']);
foreach ($wp_comments as $comment) {
    $comments[] = [
        'id' => $comment->comment_ID,
        'post_id' => $comment->comment_post_ID,
        'author' => $comment->comment_author,
        'email' => $comment->comment_author_email,
        'content' => $comment->comment_content,
        'approved' => $comment->comment_approved === '1',
        'parent_id' => $comment->comment_parent ?: null,
        'created_at' => $comment->comment_date,
    ];
}
echo "Exported " . count($comments) . " comments\n";

// Prepare export data
$export = [
    'version' => '1.0',
    'exported_at' => date('Y-m-d H:i:s'),
    'wordpress_version' => get_bloginfo('version'),
    'settings' => $settings,
    'authors' => $authors,
    'categories' => $categories,
    'tags' => $tags,
    'posts' => $posts,
    'pages' => $pages,
    'comments' => $comments,
];

// Save to file
$filename = 'ngx-blog-export.json';
file_put_contents($filename, json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "\n✅ Export complete!\n";
echo "File saved: $filename\n";
echo "\nSummary:\n";
echo "- Settings: " . count($settings) . "\n";
echo "- Authors: " . count($authors) . "\n";
echo "- Categories: " . count($categories) . "\n";
echo "- Tags: " . count($tags) . "\n";
echo "- Posts: " . count($posts) . "\n";
echo "- Pages: " . count($pages) . "\n";
echo "- Comments: " . count($comments) . "\n";
echo "\nNext step: Run 'node scripts/wordpress-import.js' in NGX Blog\n";
