import { defineTheme } from '../theme.interface';

export default defineTheme({
  id: 'modern-dark',
  name: 'Modern Dark',
  version: '1.0.0',
  author: 'NGX Blog CMS',
  description: 'A sleek dark theme for better readability',
  thumbnail: '/assets/themes/modern-dark.png',

  colors: {
    primary: '#60a5fa',
    secondary: '#a78bfa',
    accent: '#fbbf24',
    background: '#111827',
    text: '#f9fafb',
    muted: '#9ca3af',
  },

  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    headingFontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    baseFontSize: '16px',
    lineHeight: '1.6',
  },

  layout: {
    maxWidth: '1280px',
    sidebar: 'right',
    headerStyle: 'sticky',
    footerStyle: 'detailed',
  },

  features: {
    darkMode: true,
    comments: true,
    socialSharing: true,
    newsletter: true,
    search: true,
    breadcrumbs: true,
  },
});
