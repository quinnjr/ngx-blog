=================================
NGX Blog CMS - Plugin System Guide
=================================

Adding a plugin is SUPER SIMPLE! Just 3 steps:

STEP 1: Create Your Plugin Folder
----------------------------------
Create a new folder in src/plugins/ with your plugin name:
  src/plugins/my-awesome-plugin/

STEP 2: Create plugin.config.ts
--------------------------------
Copy this template into your plugin folder:

```typescript
import { definePlugin } from '../plugin.interface';

export default definePlugin({
  metadata: {
    id: 'my-awesome-plugin',
    name: 'My Awesome Plugin',
    version: '1.0.0',
    author: 'Your Name',
    description: 'Does awesome things',
    icon: 'puzzle-piece',
    category: 'utility',
  },

  settings: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'text',
      required: true,
      helpText: 'Your API key',
    },
  ],

  hooks: {
    onActivate: async (context) => {
      console.log('Plugin activated!');
    },

    afterPostPublish: async (post, context) => {
      // Do something after post is published
    },
  },
});
```

STEP 3: Register Your Plugin
-----------------------------
Open src/plugins/index.ts and add two lines:

1. Import your plugin:
   import myAwesomePlugin from './my-awesome-plugin/plugin.config';

2. Add it to the plugins array:
   export const plugins = [
     analytics,
     socialShare,
     contactForm,
     myAwesomePlugin,  // <-- Add your plugin here!
   ];

DONE! Your plugin is now available in /admin/plugins!

=================================
Plugin Lifecycle Hooks
=================================

Your plugin can hook into these events:

onInit
  Called when plugin is first loaded (app startup)

onActivate
  Called when plugin is enabled by user

onDeactivate
  Called when plugin is disabled by user

onSettingsUpdate
  Called when plugin settings are updated

beforePostPublish
  Called before a post is published
  Can modify post data

afterPostPublish
  Called after a post is published
  Great for notifications, analytics, etc.

filterPostContent
  Modify post HTML before rendering
  Perfect for shortcodes, embeds, etc.

filterPageContent
  Modify page HTML before rendering

=================================
Plugin Categories
=================================

- content: Content management features
- marketing: Marketing and conversion tools
- analytics: Analytics and tracking
- social: Social media integration
- seo: SEO optimization tools
- utility: General utilities
- other: Everything else

=================================
Setting Types
=================================

- text: Single line text input
- textarea: Multi-line text input
- number: Numeric input
- boolean: On/off toggle
- select: Dropdown with options
- color: Color picker

=================================
Examples
=================================

Check out these example plugins:

src/plugins/analytics/
  Google Analytics integration

src/plugins/social-share/
  Social media share buttons

src/plugins/contact-form/
  Contact form with email

src/plugins/_template/
  Complete template with all features

=================================
Testing Your Plugin
=================================

1. Start dev server: pnpm start
2. Go to http://localhost:4200/admin/plugins
3. Find your plugin and toggle it on
4. Click "Settings" to configure
5. Test on a post or page

=================================
Advanced Features
=================================

Add Custom Routes:
  routes: [
    {
      path: 'my-feature',
      component: MyComponent,
    },
  ]

Add Admin Menu Items:
  adminMenuItems: [
    {
      label: 'My Feature',
      icon: 'star',
      route: '/admin/my-feature',
    },
  ]

Add Dashboard Widgets:
  widgets: [
    {
      id: 'my-widget',
      title: 'My Widget',
      component: MyWidgetComponent,
      size: 'medium',
    },
  ]

=================================
Need Help?
=================================

Check out the example plugins and template!

src/plugins/_template/plugin.config.ts
  Complete template with documentation

=================================
