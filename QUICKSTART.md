# Quick Start - NGX Blog CMS

Get your blog running in **under 2 minutes**!

## 🚀 One-Command Install

Copy and paste this into your terminal:

### Linux/Mac

```bash
git clone https://github.com/PegasusHeavyIndustries/ngx-blog.git && cd ngx-blog && node scripts/setup.js && pnpm start
```

### Windows (PowerShell)

```powershell
git clone https://github.com/PegasusHeavyIndustries/ngx-blog.git; cd ngx-blog; node scripts/setup.js; pnpm start
```

That's it! Your blog will open at `http://localhost:4200` 🎉

## 📋 What Just Happened?

1. ✅ Cloned the repository
2. ✅ Installed pnpm (if needed)
3. ✅ Installed all dependencies
4. ✅ Started the development server
5. ✅ Opened your blog in the browser

## 🎯 Next Steps

### Explore Your Blog

- **Homepage**: `http://localhost:4200`
- **Admin Panel**: `http://localhost:4200/admin`

### Customize It

1. Go to **Admin** → **Themes** to change the look
2. Go to **Admin** → **Settings** to update site title
3. Go to **Admin** → **Posts** to manage content

### Start Writing

1. Click **Admin** → **Posts**
2. Click **Create New Post**
3. Write your content
4. Publish!

## 🛠️ Common Commands

```bash
# Start the development server
pnpm start

# Build for production
pnpm build

# Run production build
pnpm serve:ssr:ngx-blog-cms
```

## 📚 Need More Help?

- 📖 [Full Installation Guide](./INSTALL.md)
- 🎓 [Getting Started Tutorial](./GETTING_STARTED.md)
- 📝 [Complete Documentation](./README.md)

## 💡 Pro Tips

- **Use different port**: `pnpm start -- --port 4201`
- **Run setup only**: `node scripts/setup.js`
- **Rebuild**: `pnpm build`

---

**Having issues?** Check [INSTALL.md](./INSTALL.md) for troubleshooting!
