import { defineTheme } from '../theme.interface';

export default defineTheme({
  id: 'modern-light',
  name: 'Modern Light',
  version: '1.0.0',
  author: 'NGX Blog CMS',
  description: 'A clean and modern light theme',
  thumbnail: '/assets/themes/modern-light.png',

  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937',
    muted: '#6b7280',
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
