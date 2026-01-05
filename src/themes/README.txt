=================================
NGX Blog CMS - Custom Theme Guide
=================================

Adding a custom theme is SUPER SIMPLE! Just 3 steps:

STEP 1: Create Your Theme Folder
---------------------------------
Create a new folder in src/themes/ with your theme name:
  src/themes/my-awesome-theme/

STEP 2: Create theme.config.ts
-------------------------------
Copy this template into your theme folder:

```typescript
import { defineTheme } from '../theme.interface';

export default defineTheme({
  id: 'my-awesome-theme',
  name: 'My Awesome Theme',
  version: '1.0.0',
  author: 'Your Name',
  description: 'A brief description of your theme',

  colors: {
    primary: '#3b82f6',     // Main brand color
    secondary: '#8b5cf6',   // Secondary brand color
    accent: '#f59e0b',      // Accent color for highlights
    background: '#ffffff',  // Page background
    text: '#1f2937',        // Main text color
    muted: '#6b7280',       // Muted/secondary text
  },

  typography: {
    fontFamily: 'Inter, sans-serif',
    headingFontFamily: 'Inter, sans-serif',
    baseFontSize: '16px',
    lineHeight: '1.6',
  },

  layout: {
    maxWidth: '1280px',           // Max content width
    sidebar: 'right',              // 'left', 'right', or 'none'
    headerStyle: 'sticky',         // 'fixed', 'static', or 'sticky'
    footerStyle: 'detailed',       // 'minimal' or 'detailed'
  },

  features: {
    darkMode: true,
    comments: true,
    socialSharing: true,
    newsletter: true,
    search: true,
    breadcrumbs: true,
  },

  // Optional: Add custom CSS
  customCSS: `
    .custom-class {
      color: red;
    }
  `,

  // Optional: Add custom JavaScript
  customJS: `
    console.log('Theme loaded!');
  `,
});
```

STEP 3: Register Your Theme
----------------------------
Open src/themes/index.ts and add two lines:

1. Import your theme:
   import myAwesomeTheme from './my-awesome-theme/theme.config';

2. Add it to the themes array:
   export const themes = [
     modernLight,
     modernDark,
     minimal,
     myAwesomeTheme,  // <-- Add your theme here!
   ];

DONE! Your theme is now available in the admin panel!

=================================
Tips & Tricks
=================================

Color Palette Generators:
- coolors.co
- paletton.com
- tailwindcolor.com

Font Pairings:
- Google Fonts (fonts.google.com)
- fontpair.co

Testing Your Theme:
1. Start the dev server: pnpm start
2. Go to http://localhost:4200/admin
3. Navigate to Themes
4. Click "Activate Theme" on your new theme

Advanced: Custom Components
---------------------------
You can also create custom post/page templates:
- Create components in your theme folder
- Reference them in your theme config

Need Help?
----------
Check out the existing themes in src/themes/ for examples!

=================================
