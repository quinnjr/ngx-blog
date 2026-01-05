import { definePlugin } from '../plugin.interface';

/**
 * Plugin Template
 *
 * Copy this file to start creating your custom plugin!
 *
 * Steps:
 * 1. Copy this entire _template folder to a new folder (e.g., 'my-plugin')
 * 2. Update the configuration below
 * 3. Import your plugin in src/plugins/index.ts
 * 4. Add it to the plugins array
 * 5. That's it! Your plugin will appear in the admin panel
 */

export default definePlugin({
  metadata: {
    // Unique identifier (use lowercase with hyphens)
    id: 'my-custom-plugin',

    // Display name shown in admin panel
    name: 'My Custom Plugin',

    // Version number
    version: '1.0.0',

    // Your name or organization
    author: 'Your Name',

    // Brief description of your plugin
    description: 'A custom plugin for my blog',

    // Optional: Font Awesome icon name
    icon: 'puzzle-piece',

    // Category for organization
    category: 'utility', // 'content' | 'marketing' | 'analytics' | 'social' | 'seo' | 'utility' | 'other'

    // Optional: Plugin homepage URL
    homepage: 'https://example.com',
  },

  // Plugin settings (configurable in admin panel)
  settings: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'text',
      required: true,
      helpText: 'Your API key for the service',
    },
    {
      key: 'enabled',
      label: 'Enable Feature',
      type: 'boolean',
      defaultValue: true,
      helpText: 'Enable or disable this feature',
    },
    {
      key: 'mode',
      label: 'Mode',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Automatic', value: 'auto' },
        { label: 'Manual', value: 'manual' },
      ],
    },
    {
      key: 'maxItems',
      label: 'Maximum Items',
      type: 'number',
      defaultValue: 10,
      helpText: 'Maximum number of items to process',
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      helpText: 'Multi-line text field',
    },
    {
      key: 'primaryColor',
      label: 'Primary Color',
      type: 'color',
      defaultValue: '#3b82f6',
      helpText: 'Choose a color',
    },
  ],

  // Lifecycle hooks
  hooks: {
    // Called when plugin is first loaded
    onInit: async (context) => {
      console.log('Plugin initialized');
    },

    // Called when plugin is enabled
    onActivate: async (context) => {
      console.log('Plugin activated');
      const settings = context.getSettings();
      // Do something with settings
    },

    // Called when plugin is disabled
    onDeactivate: async (context) => {
      console.log('Plugin deactivated');
      // Clean up
    },

    // Called when settings are updated
    onSettingsUpdate: async (settings, context) => {
      console.log('Settings updated:', settings);
    },

    // Called before a post is published
    beforePostPublish: async (post, context) => {
      console.log('Before post publish:', post.title);
      // Modify post before publishing
      return post;
    },

    // Called after a post is published
    afterPostPublish: async (post, context) => {
      console.log('After post publish:', post.title);
      // Send notifications, update analytics, etc.
    },

    // Modify post content before rendering
    filterPostContent: async (content, post, context) => {
      console.log('Filtering post content');
      // Add custom HTML, shortcodes, etc.
      return content;
    },

    // Modify page content before rendering
    filterPageContent: async (content, page, context) => {
      console.log('Filtering page content');
      return content;
    },
  },

  // Optional: Add items to admin menu
  adminMenuItems: [
    {
      label: 'My Plugin',
      icon: 'puzzle-piece',
      route: '/admin/my-plugin',
      order: 100,
    },
  ],

  // Optional: Define custom routes
  routes: [
    {
      path: 'my-plugin',
      component: 'MyPluginComponent',
    },
  ],

  // Optional: Dashboard widgets
  // widgets: [
  //   {
  //     id: 'my-widget',
  //     title: 'My Widget',
  //     component: MyWidgetComponent,
  //     size: 'medium',
  //   },
  // ],
});
