# NGX Blog CMS Setup Script for Windows
Write-Host "🚀 Setting up NGX Blog CMS..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ or 20+" -ForegroundColor Red
    exit 1
}

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm $pnpmVersion found" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Build the project
Write-Host ""
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
pnpm build

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 NGX Blog CMS is ready to use!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the development server:"
Write-Host "  pnpm start" -ForegroundColor White
Write-Host ""
Write-Host "To build for production:"
Write-Host "  pnpm build" -ForegroundColor White
Write-Host ""
Write-Host "To serve the production build:"
Write-Host "  pnpm serve:ssr:ngx-blog-cms" -ForegroundColor White
Write-Host ""
Write-Host "Access the blog at: http://localhost:4200" -ForegroundColor Cyan
Write-Host "Access the admin at: http://localhost:4200/admin" -ForegroundColor Cyan
Write-Host ""
