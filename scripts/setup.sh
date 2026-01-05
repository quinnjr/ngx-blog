#!/bin/bash

# NGX Blog CMS Setup Script
echo "🚀 Setting up NGX Blog CMS..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ or 20+"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check if pnpm is installed, if not install it
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
else
    echo "✅ pnpm $(pnpm --version) found"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo ""
echo "🔨 Building the project..."
pnpm build

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 NGX Blog CMS is ready to use!"
echo ""
echo "To start the development server:"
echo "  pnpm start"
echo ""
echo "To build for production:"
echo "  pnpm build"
echo ""
echo "To serve the production build:"
echo "  pnpm serve:ssr:ngx-blog-cms"
echo ""
echo "Access the blog at: http://localhost:4200"
echo "Access the admin at: http://localhost:4200/admin"
echo ""
