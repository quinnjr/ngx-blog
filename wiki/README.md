# NGX Blog Wiki Setup

This directory contains the GitHub Wiki pages for NGX Blog.

## Setup Instructions

The GitHub Wiki needs to be initialized before you can push pages:

### Step 1: Initialize Wiki

Visit: https://github.com/pegasusheavy/ngx-blog/wiki

Click "Create the first page" to initialize the wiki.

### Step 2: Push Wiki Pages

Run the setup script:

```bash
./scripts/setup-wiki.sh
```

Or manually:

```bash
# Clone wiki repository
git clone https://github.com/pegasusheavy/ngx-blog.wiki.git /tmp/wiki

# Copy pages
cp wiki/*.md /tmp/wiki/

# Commit and push
cd /tmp/wiki
git add .
git commit -m "docs: add wiki documentation"
git push origin main
```

## Wiki Pages

- **Home.md** - Wiki homepage
- **Installation.md** - Installation instructions
- **Quick-Start.md** - Quick start guide
- **Configuration.md** - Configuration guide
- **Docker-Deployment.md** - Docker deployment guide
- **WordPress-Migration.md** - WordPress migration guide

## Adding New Pages

1. Create `New-Page.md` in this directory
2. Run `./scripts/setup-wiki.sh` to update the wiki
3. Link from other pages using `[Link Text](New-Page)`

## Wiki Links

Use relative links between wiki pages:

```markdown
[Installation](Installation)
[Quick Start](Quick-Start)
[Configuration](Configuration)
```

## View Wiki

https://github.com/pegasusheavy/ngx-blog/wiki
