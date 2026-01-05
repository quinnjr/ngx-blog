/**
 * Settings Loader
 * Loads and caches site settings from database
 * WordPress-style configuration management
 *
 * Mimics WordPress's wp_options system:
 * - Autoload mechanism for performance
 * - Key-value storage
 * - Global access via get_option()
 * - Cached in memory
 */

interface Setting {
  key: string;
  value: string;
  type: string;
  autoload: boolean;
}

/**
 * Option name aliases
 * Maps old names to WordPress-compatible names
 */
const OPTION_ALIASES: Record<string, string> = {
  'site_title': 'blogname',
  'site_description': 'blogdescription',
  'site_url': 'siteurl',
  'rss_posts_count': 'posts_per_rss',
  'active_theme': 'template',
  'site_language': 'WPLANG',
  'comments_enabled': 'default_comment_status',
  'close_comments_days': 'close_comments_days_old',
};

export class SettingsLoader {
  private static settings: Map<string, any> = new Map();
  private static loaded = false;
  private static loading: Promise<void> | null = null;

  /**
   * Load settings from database
   */
  static async load(prisma: any): Promise<void> {
    // If already loading, wait for that to complete
    if (this.loading) {
      return this.loading;
    }

    // If already loaded, return immediately
    if (this.loaded) {
      return;
    }

    // Start loading
    this.loading = (async () => {
      try {
        const settings = await prisma.setting.findMany({
          where: { autoload: true },
        });

        for (const setting of settings) {
          this.settings.set(setting.key, this.parseValue(setting.value, setting.type));
        }

        this.loaded = true;
        console.log(`✅ Loaded ${settings.length} settings from database`);
      } catch (error) {
        console.error('Failed to load settings:', error);
        throw error;
      } finally {
        this.loading = null;
      }
    })();

    return this.loading;
  }

  /**
   * Get a setting value (WordPress-style: get_option)
   *
   * Supports both our names and WordPress aliases:
   * - get('site_title') or get('blogname') both work
   *
   * @param key Setting key (supports WordPress aliases)
   * @param defaultValue Default if not found
   */
  static get<T = any>(key: string, defaultValue?: T): T {
    if (!this.loaded) {
      console.warn(`Settings not loaded yet, returning default for: ${key}`);
      return defaultValue as T;
    }

    // Check for alias (old name → new name)
    const actualKey = OPTION_ALIASES[key] || key;

    return this.settings.has(actualKey) ? this.settings.get(actualKey) : defaultValue;
  }

  /**
   * Alias for get() - WordPress-style function name
   */
  static get_option<T = any>(option: string, defaultValue?: T): T {
    return this.get(option, defaultValue);
  }

  /**
   * Get all settings
   */
  static getAll(): Record<string, any> {
    return Object.fromEntries(this.settings);
  }

  /**
   * Reload settings from database
   */
  static async reload(prisma: any): Promise<void> {
    this.loaded = false;
    this.settings.clear();
    await this.load(prisma);
  }

  /**
   * Parse setting value based on type (public for server use)
   */
  static parseValue(value: string, type: string): any {
    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true' || value === '1';
      case 'json':
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      default:
        return value;
    }
  }

  /**
   * Convert value to string for storage
   */
  static serializeValue(value: any, type: string): string {
    switch (type) {
      case 'boolean':
        return value ? 'true' : 'false';
      case 'json':
        return JSON.stringify(value);
      default:
        return String(value);
    }
  }

  /**
   * Update a setting in cache (call after DB update)
   * WordPress-style: update_option
   */
  static update(key: string, value: any): void {
    // Check for alias
    const actualKey = OPTION_ALIASES[key] || key;
    this.settings.set(actualKey, value);
  }

  /**
   * Alias for update() - WordPress-style function name
   */
  static update_option(option: string, value: any): void {
    this.update(option, value);
  }

  /**
   * Delete a setting from cache
   * WordPress-style: delete_option
   */
  static delete(key: string): void {
    const actualKey = OPTION_ALIASES[key] || key;
    this.settings.delete(actualKey);
  }

  /**
   * Alias for delete() - WordPress-style function name
   */
  static delete_option(option: string): void {
    this.delete(option);
  }

  /**
   * Check if settings are loaded
   */
  static isLoaded(): boolean {
    return this.loaded;
  }
}
