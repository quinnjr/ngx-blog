#!/bin/bash
# Setup GitHub Wiki
# Run this after initializing the wiki at https://github.com/pegasusheavy/ngx-blog/wiki

set -e

WIKI_REPO="https://github.com/pegasusheavy/ngx-blog.wiki.git"
WIKI_DIR="/tmp/ngx-blog-wiki-setup"

echo "📚 Setting up NGX Blog Wiki..."
echo ""

# Check if wiki is initialized
echo "⚠️  Make sure you've initialized the wiki first by visiting:"
echo "   https://github.com/pegasusheavy/ngx-blog/wiki"
echo ""
read -p "Press Enter once the wiki is initialized..."

# Clone wiki
echo "📥 Cloning wiki repository..."
rm -rf "$WIKI_DIR"
git clone "$WIKI_REPO" "$WIKI_DIR"

# Copy wiki pages
echo "📝 Copying wiki pages..."
cp wiki/*.md "$WIKI_DIR/"

# Commit and push
cd "$WIKI_DIR"
echo "💾 Committing changes..."
git add .
git commit -m "docs: add comprehensive wiki documentation"

echo "🚀 Pushing to GitHub..."
git push origin main || git push origin master

echo ""
echo "✅ Wiki setup complete!"
echo "📖 Visit: https://github.com/pegasusheavy/ngx-blog/wiki"
echo ""

# Cleanup
cd -
rm -rf "$WIKI_DIR"
