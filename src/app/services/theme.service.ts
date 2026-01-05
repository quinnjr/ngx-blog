import { Injectable, signal, computed, effect } from '@angular/core';
import { Theme, ThemeConfig, ThemeCustomization } from '../models';
import { themes } from '../../themes';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected-theme';
  private readonly CUSTOMIZATION_KEY = 'theme-customization';

  private activeTheme = signal<Theme | null>(null);
  private customization = signal<ThemeCustomization | null>(null);

  public theme = computed(() => this.activeTheme());
  public config = computed(() => {
    const theme = this.activeTheme();
    const custom = this.customization();

    if (!theme) return null;

    if (custom && custom.themeId === theme.id) {
      return { ...theme.config, ...custom.overrides };
    }

    return theme.config;
  });

  constructor() {
    // Load theme from localStorage on init
    this.loadSavedTheme();

    // Apply theme whenever it changes
    effect(() => {
      const config = this.config();
      if (config) {
        this.applyThemeToDOM(config);
      }
    });
  }

  /**
   * Get all available themes
   */
  getAvailableThemes(): Theme[] {
    // In a real app, this would fetch from a backend or load from local storage
    return this.getDefaultThemes();
  }

  /**
   * Set the active theme
   */
  setTheme(theme: Theme): void {
    this.activeTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme.id);
  }

  /**
   * Get theme by ID
   */
  getThemeById(id: string): Theme | null {
    const themes = this.getAvailableThemes();
    return themes.find(t => t.id === id) || null;
  }

  /**
   * Apply theme customization
   */
  customizeTheme(customization: ThemeCustomization): void {
    this.customization.set(customization);
    localStorage.setItem(this.CUSTOMIZATION_KEY, JSON.stringify(customization));
  }

  /**
   * Reset theme to default
   */
  resetTheme(): void {
    this.customization.set(null);
    localStorage.removeItem(this.CUSTOMIZATION_KEY);
  }

  /**
   * Apply theme configuration to DOM
   */
  private applyThemeToDOM(config: ThemeConfig): void {
    const root = document.documentElement;

    // Apply colors
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-secondary', config.colors.secondary);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-background', config.colors.background);
    root.style.setProperty('--color-text', config.colors.text);
    root.style.setProperty('--color-muted', config.colors.muted);

    // Apply typography
    root.style.setProperty('--font-family', config.typography.fontFamily);
    root.style.setProperty('--heading-font-family', config.typography.headingFontFamily || config.typography.fontFamily);
    root.style.setProperty('--font-size-base', config.typography.baseFontSize);
    root.style.setProperty('--line-height', config.typography.lineHeight);

    // Apply layout
    root.style.setProperty('--max-width', config.layout.maxWidth);

    // Apply custom CSS if provided
    if (config.customCSS) {
      this.injectCustomStyles(config.customCSS);
    }
  }

  /**
   * Inject custom CSS into the page
   */
  private injectCustomStyles(css: string): void {
    const styleId = 'theme-custom-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }

  /**
   * Load saved theme from localStorage
   */
  private loadSavedTheme(): void {
    const savedThemeId = localStorage.getItem(this.THEME_KEY);
    const savedCustomization = localStorage.getItem(this.CUSTOMIZATION_KEY);

    if (savedThemeId) {
      const theme = this.getThemeById(savedThemeId);
      if (theme) {
        this.activeTheme.set(theme);
      } else {
        // Load default theme if saved theme not found
        this.loadDefaultTheme();
      }
    } else {
      this.loadDefaultTheme();
    }

    if (savedCustomization) {
      try {
        this.customization.set(JSON.parse(savedCustomization));
      } catch (e) {
        console.error('Failed to parse theme customization', e);
      }
    }
  }

  /**
   * Load the default theme
   */
  private loadDefaultTheme(): void {
    const themes = this.getDefaultThemes();
    const defaultTheme = themes.find(t => t.id === 'modern-light');
    if (defaultTheme) {
      this.activeTheme.set(defaultTheme);
    }
  }

  /**
   * Get default themes from theme registry
   */
  private getDefaultThemes(): Theme[] {
    return themes.map((themeConfig, index) => ({
      id: themeConfig.id,
      name: themeConfig.name,
      version: themeConfig.version,
      author: themeConfig.author,
      description: themeConfig.description,
      thumbnail: themeConfig.thumbnail || `/assets/themes/${themeConfig.id}.png`,
      active: index === 0, // First theme is active by default
      createdAt: new Date(),
      updatedAt: new Date(),
      config: {
        colors: themeConfig.colors,
        typography: themeConfig.typography,
        layout: themeConfig.layout,
        features: themeConfig.features,
        customCSS: themeConfig.customCSS,
        customJS: themeConfig.customJS,
      },
      templates: [
        {
          name: 'Default Post',
          type: 'post',
          componentPath: `themes/${themeConfig.id}/post-template`
        },
        {
          name: 'Default Page',
          type: 'page',
          componentPath: `themes/${themeConfig.id}/page-template`
        }
      ]
    }));
  }
}
