# NGX Blog CMS - Installation Guide

## Prerequisites

Before installing NGX Blog CMS, ensure you have:

- **Node.js 18+** or **20+** ([Download here](https://nodejs.org))
- **Git** for cloning the repository
- **pnpm** (will be auto-installed if missing)

## Installation Methods

### 🚀 Quick Install (Recommended)

This is the fastest way to get started:

```bash
# Clone the repository
git clone https://github.com/yourusername/ngx-blog.git
cd ngx-blog

# Run the setup script
pnpm setup

# Start the development server
pnpm start
```

The setup script will:

1. Check Node.js installation
2. Install pnpm if needed
3. Install all dependencies
4. Provide next steps

### 📦 Platform-Specific Setup Scripts

#### Linux/Mac

```bash
cd ngx-blog
./scripts/setup.sh
pnpm start
```

#### Windows (PowerShell)

```powershell
cd ngx-blog
.\scripts\setup.ps1
pnpm start
```

#### Windows (Command Prompt)

```cmd
cd ngx-blog
node scripts\setup.js
pnpm start
```

### 🔧 Manual Installation

If you prefer to install manually:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ngx-blog.git
cd ngx-blog

# 2. Install pnpm globally (if not already installed)
npm install -g pnpm

# 3. Install project dependencies
pnpm install

# 4. Start the development server
pnpm start
```

## Verification

After installation, verify everything is working:

1. **Development server should start** at `http://localhost:4200`
2. **Homepage loads** with demo posts and categories
3. **Admin panel accessible** at `http://localhost:4200/admin`
4. **Themes can be switched** in Admin → Themes

## First-Time Setup

After installation:

1. **Visit the homepage**: `http://localhost:4200`
   - Browse demo posts
   - Test navigation
   - View categories

2. **Access the admin panel**: `http://localhost:4200/admin`
   - Explore the dashboard
   - View demo posts and pages
   - Try switching themes
   - Configure settings

3. **Customize your blog**:
   - Update site title in Admin → Settings
   - Choose your preferred theme
   - Add your own content

## Common Issues

### Port 4200 Already in Use

If port 4200 is busy:

```bash
pnpm start -- --port 4201
```

### Permission Denied on Setup Scripts

**Linux/Mac:**

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Windows:** Run PowerShell as Administrator

### pnpm Not Found

Install pnpm globally:

```bash
npm install -g pnpm
```

Or use npx:

```bash
npx pnpm install
npx pnpm start
```

### Build Errors

Clear the Angular cache and rebuild:

```bash
rm -rf .angular node_modules
pnpm install
pnpm build
```

### Module Not Found Errors

Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json pnpm-lock.yaml
pnpm install
```

## Production Deployment

### Build for Production

```bash
pnpm build
```

This creates optimized production bundles in `dist/ngx-blog-cms/`

### Serve Production Build

```bash
pnpm serve:ssr:ngx-blog-cms
```

The production build includes:

- Server-side rendering (SSR)
- Optimized bundles
- Minified assets
- Pre-rendered static routes

### Deploy to Hosting

The production build can be deployed to:

- **Vercel**: `vercel deploy`
- **Netlify**: Deploy `dist/ngx-blog-cms/browser` folder
- **AWS/Azure**: Deploy as Node.js application
- **Docker**: Create a Docker container
- **Traditional Hosting**: Upload `dist/ngx-blog-cms/` folder

## Environment Configuration

### Development

Create `.env.development` (optional):

```env
API_URL=http://localhost:3000
SITE_URL=http://localhost:4200
```

### Production

Create `.env.production` (optional):

```env
API_URL=https://api.yourdomain.com
SITE_URL=https://yourdomain.com
```

## Next Steps

After installation:

1. Read [GETTING_STARTED.md](./GETTING_STARTED.md) for usage guide
2. Read [README.md](./README.md) for feature overview
3. Explore the admin panel
4. Start creating content!

## Updating

To update to the latest version:

```bash
git pull origin main
pnpm install
pnpm build
```

## Uninstalling

To remove the project:

```bash
cd ..
rm -rf ngx-blog
```

To remove global pnpm:

```bash
npm uninstall -g pnpm
```

## Support

For installation issues:

1. Check this guide for common issues
2. Verify Node.js version: `node --version`
3. Check pnpm version: `pnpm --version`
4. Review error messages in terminal
5. Check Angular error logs

## System Requirements

### Minimum Requirements

- **CPU**: 2-core processor
- **RAM**: 4 GB
- **Disk**: 500 MB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

### Recommended Requirements

- **CPU**: 4-core processor
- **RAM**: 8 GB
- **Disk**: 1 GB free space
- **OS**: Latest stable version

## Development Tools

Recommended tools for development:

- **VS Code** with Angular Language Service extension
- **Chrome DevTools** for debugging
- **Angular DevTools** browser extension
- **Tailwind CSS IntelliSense** extension

---

**Ready to start blogging?** Run `pnpm start` and visit `http://localhost:4200`! 🚀
