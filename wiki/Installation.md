# Installation

## Prerequisites

- **Node.js** 20.x or later
- **pnpm** 10.x or later (recommended) or npm
- **PostgreSQL** 15+ database
- **Git**

## Method 1: Using `ng add` (Recommended)

The easiest way to install NGX Blog:

```bash
ng add @pegasusheavy/ngx-blog-cms
```

This will:

- Install all dependencies
- Set up the project structure
- Configure Tailwind CSS
- Create environment files
- Run initial migrations

## Method 2: Clone Repository

```bash
# Clone the repository
git clone https://github.com/PegasusHeavyIndustries/ngx-blog.git
cd ngx-blog

# Install dependencies
pnpm install

# Run setup script
pnpm setup
```

## Method 3: NPM Package

```bash
# Install as a package
pnpm add @pegasusheavy/ngx-blog-cms

# Or with npm
npm install @pegasusheavy/ngx-blog-cms
```

## Database Setup

### Option 1: Local PostgreSQL

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE ngx_blog;
CREATE USER ngx_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ngx_blog TO ngx_user;
\q
```

### Option 2: Docker PostgreSQL

```bash
docker run -d \
  --name ngx-blog-postgres \
  -e POSTGRES_DB=ngx_blog \
  -e POSTGRES_USER=ngx_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15-alpine
```

### Option 3: Cloud Database

- **Neon**: https://neon.tech (Free tier)
- **Supabase**: https://supabase.com (Free tier)
- **Railway**: https://railway.app (Free tier)

## Configuration

Create `.env.local`:

```env
DATABASE_URL="postgresql://ngx_user:your_password@localhost:5432/ngx_blog"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
NODE_ENV=development
```

## Run Migrations

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed default settings
pnpm prisma db seed
```

## Start Development Server

```bash
pnpm dev
```

Visit: http://localhost:4200

## Verify Installation

Check that everything is working:

```bash
# Health check
curl http://localhost:4000/api/health

# Should return: {"status":"ok","database":"connected"}
```

## Next Steps

- [Quick Start Guide](Quick-Start)
- [Configure Your Blog](Configuration)
- [Create Your First Post](Creating-Content)

## Troubleshooting

See [Troubleshooting Guide](Troubleshooting) if you encounter issues.
