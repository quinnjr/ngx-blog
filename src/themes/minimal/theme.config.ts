import { defineTheme } from '../theme.interface';

export default defineTheme({
  id: 'minimal',
  name: 'Minimal',
  version: '1.0.0',
  author: 'NGX Blog CMS',
  description: 'A minimalist theme focused on content',
  thumbnail: '/assets/themes/minimal.png',

  colors: {
    primary: '#000000',
    secondary: '#6b7280',
    accent: '#ef4444',
    background: '#ffffff',
    text: '#000000',
    muted: '#9ca3af',
  },

  typography: {
    fontFamily: 'Georgia, serif',
    headingFontFamily: 'Georgia, serif',
    baseFontSize: '18px',
    lineHeight: '1.8',
  },

  layout: {
    maxWidth: '720px',
    sidebar: 'none',
    headerStyle: 'static',
    footerStyle: 'minimal',
  },

  features: {
    darkMode: false,
    comments: true,
    socialSharing: false,
    newsletter: false,
    search: false,
    breadcrumbs: false,
  },
});
