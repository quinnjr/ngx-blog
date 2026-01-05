/**
 * Simple Theme Configuration Interface
 *
 * Create a theme.config.ts file in your theme folder with this structure
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
  [key: string]: string; // Allow custom color properties
}

export interface ThemeTypography {
  fontFamily: string;
  headingFontFamily?: string;
  baseFontSize: string;
  lineHeight: string;
}

export interface ThemeLayout {
  maxWidth: string;
  sidebar: 'left' | 'right' | 'none';
  headerStyle: 'fixed' | 'static' | 'sticky';
  footerStyle: 'minimal' | 'detailed';
}

export interface ThemeFeatures {
  darkMode: boolean;
  comments: boolean;
  socialSharing: boolean;
  newsletter: boolean;
  search: boolean;
  breadcrumbs: boolean;
}

export interface ThemeConfig {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  thumbnail?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  features: ThemeFeatures;
  customCSS?: string;
  customJS?: string;
}

/**
 * Simple helper to create a theme config
 */
export function defineTheme(config: ThemeConfig): ThemeConfig {
  return config;
}
