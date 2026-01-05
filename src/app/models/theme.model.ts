export interface Theme {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  thumbnail: string;
  config: ThemeConfig;
  templates: ThemeTemplate[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    fontFamily: string;
    headingFontFamily?: string;
    baseFontSize: string;
    lineHeight: string;
  };
  layout: {
    maxWidth: string;
    sidebar: 'left' | 'right' | 'none';
    headerStyle: 'fixed' | 'static' | 'sticky';
    footerStyle: 'minimal' | 'detailed';
  };
  features: {
    darkMode: boolean;
    comments: boolean;
    socialSharing: boolean;
    newsletter: boolean;
    search: boolean;
    breadcrumbs: boolean;
  };
  customCSS?: string;
  customJS?: string;
}

export interface ThemeTemplate {
  name: string;
  type: 'post' | 'page' | 'category' | 'tag' | 'archive' | 'search' | 'author' | '404';
  componentPath: string;
  previewImage?: string;
}

export interface ThemeCustomization {
  themeId: string;
  overrides: Partial<ThemeConfig>;
  customWidgets?: Widget[];
  menuLocations?: {
    primary?: Menu;
    secondary?: Menu;
    footer?: Menu;
  };
}

export interface Widget {
  id: string;
  type: 'recent-posts' | 'categories' | 'tags' | 'search' | 'newsletter' | 'custom' | 'social';
  title: string;
  position: 'sidebar' | 'footer' | 'header';
  order: number;
  config: Record<string, any>;
  active: boolean;
}

export interface Menu {
  id: string;
  name: string;
  location: 'primary' | 'secondary' | 'footer';
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  target?: '_blank' | '_self';
  icon?: string;
  order: number;
  parentId?: string;
  children?: MenuItem[];
}
