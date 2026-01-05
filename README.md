# NGX Blog CMS

[![Angular](https://img.shields.io/badge/Angular-21+-DD0031?style=flat&logo=angular)](https://angular.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A modern, feature-rich blogging platform built with Angular 21+ and Tailwind CSS 4.1.18. Inspired by WordPress, but completely reimagined for the modern web with Angular's powerful features.

**✨ Clone, run one command, and start blogging!**

## Features

### 🎨 Theme System

- **Multiple Pre-built Themes**: Modern Light, Modern Dark, and Minimal themes included
- **Dynamic Theme Switching**: Change themes instantly without page reload
- **Customizable**: Full control over colors, typography, layout, and features
- **Theme Persistence**: Your theme selection is saved in localStorage

### 📝 Content Management

- **Posts & Pages**: Full-featured blog posts and static pages
- **Rich Content**: Support for featured images, excerpts, and rich text content
- **Categories & Tags**: Organize content with hierarchical categories and tags
- **Draft & Publish**: Multiple post statuses (draft, published, scheduled, archived)
- **Author Management**: Author profiles with social links

### 🔍 SEO & AEO Optimized

- **Meta Tags**: Complete control over page titles, descriptions, and keywords
- **Open Graph**: Full Open Graph protocol support for social media
- **Twitter Cards**: Optimized Twitter Card metadata
- **Structured Data**: JSON-LD structured data for better search engine understanding
- **Canonical URLs**: Proper canonical URL management
- **Sitemap Generation**: Automatic sitemap generation support
- **Server-Side Rendering**: Built with Angular Universal for SEO-friendly SSR

### 🎯 Modern Architecture

- **Angular 21+ Signals**: Reactive state management with Angular Signals
- **Standalone Components**: Modern Angular standalone component architecture
- **Lazy Loading**: Route-level code splitting for optimal performance
- **TypeScript**: Fully typed for better developer experience
- **Tailwind CSS 4+**: Utility-first CSS with PostCSS configuration
- **Font Awesome**: 1000+ icons ready to use

### 📱 Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Great experience on tablets and mobile devices
- **Adaptive UI**: Components adapt to available screen space

## 📚 Documentation

Full documentation is available in the [GitHub Wiki](https://github.com/pegasusheavy/ngx-blog/wiki):

- [Installation Guide](https://github.com/pegasusheavy/ngx-blog/wiki/Installation)
- [Quick Start](https://github.com/pegasusheavy/ngx-blog/wiki/Quick-Start)
- [Configuration](https://github.com/pegasusheavy/ngx-blog/wiki/Configuration)
- [WordPress Migration](https://github.com/pegasusheavy/ngx-blog/wiki/WordPress-Migration)
- [Docker Deployment](https://github.com/pegasusheavy/ngx-blog/wiki/Docker-Deployment)

## 📦 Installation

### Using `ng add` (Recommended)

```bash
ng add @pegasusheavy/ngx-blog-cms
```

### Manual Installation

```bash
# Clone repository
git clone https://github.com/PegasusHeavyIndustries/ngx-blog.git
cd ngx-blog

# Install dependencies
pnpm install

# Setup (creates .env.local, runs migrations)
pnpm setup

# Start development server
pnpm dev
```

## 🚀 Quick Start

### One-Command Install (Easiest!)

Copy and paste this into your terminal:

**Linux/Mac:**

```bash
git clone https://github.com/PegasusHeavyIndustries/ngx-blog.git && cd ngx-blog && node scripts/setup.js && pnpm start
```

**Windows (PowerShell):**

```powershell
git clone https://github.com/PegasusHeavyIndustries/ngx-blog.git; cd ngx-blog; node scripts/setup.js; pnpm start
```

That's it! Your blog opens at `http://localhost:4200` 🎉

👉 **For more options**, see [INSTALL.md](./INSTALL.md) or [QUICKSTART.md](./QUICKSTART.md)

### Prerequisites

- **Node.js 18+** or **20+** ([Download](https://nodejs.org))
- **Git** for cloning
- **pnpm** (auto-installed by setup script)

## Project Structure

```
ngx-blog/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── admin/          # Admin panel components
│   │   │   │   ├── dashboard/
│   │   │   │   ├── posts/
│   │   │   │   ├── pages/
│   │   │   │   ├── categories/
│   │   │   │   ├── themes/
│   │   │   │   └── settings/
│   │   │   ├── public/         # Public-facing components
│   │   │   │   ├── home/
│   │   │   │   ├── post-detail/
│   │   │   │   ├── page-detail/
│   │   │   │   ├── header/
│   │   │   │   └── footer/
│   │   │   └── shared/         # Shared components
│   │   ├── models/             # TypeScript interfaces & types
│   │   │   ├── post.model.ts
│   │   │   ├── page.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── tag.model.ts
│   │   │   └── theme.model.ts
│   │   ├── services/           # Business logic & state management
│   │   │   ├── post.service.ts
│   │   │   ├── page.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── theme.service.ts
│   │   │   └── seo.service.ts
│   │   ├── app.routes.ts       # Route configuration
│   │   └── app.ts              # Root component
│   ├── styles.css              # Global styles with Tailwind
│   └── index.html
├── .postcssrc.json             # PostCSS configuration for Tailwind
├── angular.json                # Angular CLI configuration
├── package.json
└── tsconfig.json
```

## Usage Guide

### Accessing the Admin Panel

Navigate to `/admin` to access the admin panel where you can:

- Create and manage posts
- Create and manage pages
- Organize categories
- Switch and customize themes
- Configure site settings

### Creating Content

#### Posts

1. Navigate to Admin → Posts
2. Click "Create New Post"
3. Fill in the post details:
   - Title and slug
   - Content (supports HTML)
   - Featured image
   - Categories and tags
   - SEO metadata
4. Choose status (draft/published)
5. Save

#### Pages

1. Navigate to Admin → Pages
2. Click "Create New Page"
3. Fill in page details:
   - Title and slug
   - Content
   - Template type
   - SEO metadata
4. Save

### Customizing Themes

1. Navigate to Admin → Themes
2. Browse available themes
3. Click "Activate Theme" on your preferred theme
4. Customize colors, typography, and features
5. Changes are applied instantly

### Managing Categories

1. Navigate to Admin → Categories
2. Click "Create New Category"
3. Fill in category details:
   - Name and slug
   - Description
   - Color (for visual identification)
   - Parent category (for hierarchy)
4. Save

## Configuration

### Tailwind CSS

The project uses Tailwind CSS 4+ with PostCSS. Configuration is in `.postcssrc.json`:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### Custom Styles

Global styles are defined in `src/styles.css` including:

- Tailwind CSS imports
- CSS custom properties for theming
- Prose styles for rich content
- Utility classes

### Environment Configuration

To configure the site:

1. Navigate to Admin → Settings
2. Update general settings (site title, description, URL)
3. Configure SEO defaults
4. Add social media links
5. Save settings

## Data Storage

Currently, the application uses `localStorage` for data persistence. This is perfect for development and demonstration purposes.

### Production Considerations

For production use, consider integrating:

- **Backend API**: RESTful API or GraphQL for data management
- **Database**: PostgreSQL, MongoDB, or Firebase
- **File Storage**: AWS S3, Cloudinary for media files
- **Authentication**: JWT, OAuth2 for user management

## SEO Best Practices

The CMS is built with SEO in mind:

1. **Meta Tags**: Every post/page has customizable meta tags
2. **Structured Data**: JSON-LD structured data for rich snippets
3. **Semantic HTML**: Proper heading hierarchy and semantic elements
4. **Image Optimization**: Alt tags and proper sizing
5. **URL Structure**: Clean, descriptive URLs
6. **Server-Side Rendering**: Pre-rendered content for search engines

### Improving SEO

1. Fill in all SEO fields for posts/pages
2. Use descriptive titles and meta descriptions
3. Add relevant keywords
4. Include high-quality images with alt text
5. Create internal links between posts
6. Submit sitemap to search engines

## Customization

### Adding a New Theme

1. Create theme configuration in `ThemeService.getDefaultThemes()`
2. Define colors, typography, layout, and features
3. Theme will appear in Admin → Themes

### Creating Custom Components

All components follow the pattern:

- `component-name.component.ts` - TypeScript logic
- `component-name.component.html` - Template
- `component-name.component.css` - Styles

Example:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.css'],
})
export class CustomComponent {}
```

## Development

### Adding New Features

1. Create models in `src/app/models/`
2. Create services in `src/app/services/`
3. Create components in `src/app/components/`
4. Add routes in `src/app/app.routes.ts`

### Code Style

- Use Angular Signals for reactive state
- Follow Angular style guide
- Use TypeScript strict mode
- Separate HTML/CSS from TypeScript
- Use Tailwind utility classes

## Performance Optimization

- **Lazy Loading**: Routes are lazy-loaded
- **Code Splitting**: Automatic chunk splitting
- **Tree Shaking**: Unused code is removed
- **Minification**: Production builds are minified
- **Caching**: Static assets are cached
- **SSR**: Server-side rendering for faster initial load

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

## Roadmap

Future enhancements planned:

- [ ] Rich text editor (WYSIWYG)
- [ ] Comment system
- [ ] User authentication
- [ ] Role-based permissions
- [ ] Media library
- [ ] Email newsletter integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Import/Export functionality
- [ ] API for headless CMS mode

## Quick Links

- 📖 [Installation Guide](./INSTALL.md) - Detailed installation instructions
- 🚀 [Getting Started](./GETTING_STARTED.md) - First steps and usage guide
- 📝 [Contributing](#contributing) - How to contribute
- 🐛 [Report Issues](https://github.com/yourusername/ngx-blog/issues) - Bug reports and feature requests

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -am 'Add my feature'`
6. Push: `git push origin feature/my-feature`
7. Create a Pull Request

Please ensure:

- Code follows Angular style guide
- Components separate HTML/CSS/TS
- All features are documented
- Tests pass (when implemented)

## Credits

Built with:

- **Angular 21+** - Modern web framework
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Angular SSR** - Server-side rendering

---

Made with ❤️ by [Pegasus Heavy Industries](https://github.com/PegasusHeavyIndustries)
