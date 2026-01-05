import { defineTheme } from '../theme.interface';

/**
 * Theme Template
 *
 * Copy this file to start creating your custom theme!
 *
 * Steps:
 * 1. Copy this entire _template folder to a new folder (e.g., 'my-theme')
 * 2. Update the configuration below
 * 3. Import your theme in src/themes/index.ts
 * 4. Add it to the themes array
 * 5. That's it! Your theme will appear in the admin panel
 */

export default defineTheme({
  // Unique identifier (use lowercase with hyphens)
  id: 'my-custom-theme',

  // Display name shown in admin panel
  name: 'My Custom Theme',

  // Version number
  version: '1.0.0',

  // Your name or organization
  author: 'Your Name',

  // Brief description of your theme
  description: 'A custom theme for my blog',

  // Optional: Path to thumbnail image
  thumbnail: '/assets/themes/my-custom-theme.png',

  // Color scheme
  colors: {
    primary: '#3b82f6',      // Main brand color (buttons, links)
    secondary: '#8b5cf6',    // Secondary color
    accent: '#f59e0b',       // Accent color for highlights
    background: '#ffffff',   // Page background color
    text: '#1f2937',         // Main text color
    muted: '#6b7280',        // Secondary/muted text color

    // You can add custom colors too!
    // success: '#10b981',
    // error: '#ef4444',
  },

  // Typography settings
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    headingFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    baseFontSize: '16px',
    lineHeight: '1.6',
  },

  // Layout configuration
  layout: {
    maxWidth: '1280px',           // Maximum content width
    sidebar: 'right',              // 'left', 'right', or 'none'
    headerStyle: 'sticky',         // 'fixed', 'static', or 'sticky'
    footerStyle: 'detailed',       // 'minimal' or 'detailed'
  },

  // Feature toggles
  features: {
    darkMode: true,          // Enable dark mode toggle
    comments: true,          // Show comments section
    socialSharing: true,     // Show social share buttons
    newsletter: true,        // Show newsletter signup
    search: true,            // Show search functionality
    breadcrumbs: true,       // Show breadcrumb navigation
  },

  // Optional: Custom CSS (will be injected into the page)
  customCSS: `
    /* Add your custom CSS here */
    .my-custom-class {
      /* Your styles */
    }
  `,

  // Optional: Custom JavaScript (will be injected into the page)
  customJS: `
    // Add your custom JavaScript here
    console.log('My custom theme loaded!');
  `,
});
