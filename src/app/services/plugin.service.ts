import { Injectable, signal, computed } from '@angular/core';
import { PluginConfig, PluginState, PluginContext, PluginHooks } from '../../plugins/plugin.interface';
import { plugins } from '../../plugins';

@Injectable({
  providedIn: 'root'
})
export class PluginService {
  private pluginStates = signal<Map<string, PluginState>>(new Map());
  private pluginConfigs = signal<Map<string, PluginConfig>>(new Map());

  // Public signals
  public installedPlugins = computed(() => {
    return Array.from(this.pluginConfigs().values()).map(config => ({
      ...config.metadata,
      enabled: this.pluginStates().get(config.metadata.id)?.enabled ?? config.enabled ?? true,
      settings: this.pluginStates().get(config.metadata.id)?.settings ?? {},
    }));
  });

  public enabledPlugins = computed(() => {
    return this.installedPlugins().filter(p => p.enabled);
  });

  constructor() {
    this.loadPlugins();
  }

  /**
   * Initialize all plugins
   */
  private loadPlugins(): void {
    // Load plugin configs
    plugins.forEach(config => {
      this.pluginConfigs.update(map => {
        map.set(config.metadata.id, config);
        return new Map(map);
      });
    });

    // Load plugin states from localStorage
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('plugin-states');
      if (saved) {
        try {
          const states = JSON.parse(saved);
          this.pluginStates.set(new Map(Object.entries(states)));
        } catch (e) {
          console.error('Failed to load plugin states', e);
        }
      }
    }

    // Initialize enabled plugins
    this.enabledPlugins().forEach(plugin => {
      const config = this.pluginConfigs().get(plugin.id);
      if (config?.hooks?.onInit) {
        const context = this.createContext(plugin.id);
        config.hooks.onInit(context);
      }
    });
  }

  /**
   * Create plugin context
   */
  private createContext(pluginId: string): PluginContext {
    return {
      getSettings: () => {
        const state = this.pluginStates().get(pluginId);
        const config = this.pluginConfigs().get(pluginId);

        // Merge default values with saved settings
        const defaults: Record<string, any> = {};
        config?.settings?.forEach(setting => {
          if (setting.defaultValue !== undefined) {
            defaults[setting.key] = setting.defaultValue;
          }
        });

        return { ...defaults, ...(state?.settings ?? {}) };
      },

      updateSettings: async (settings: Record<string, any>) => {
        await this.updatePluginSettings(pluginId, settings);
      },

      services: {
        // Services will be injected here
      },
    };
  }

  /**
   * Enable a plugin
   */
  async enablePlugin(pluginId: string): Promise<void> {
    const config = this.pluginConfigs().get(pluginId);
    if (!config) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // Update state
    this.pluginStates.update(map => {
      const existing = map.get(pluginId);
      map.set(pluginId, {
        id: pluginId,
        enabled: true,
        settings: existing?.settings ?? {},
        installedAt: existing?.installedAt ?? new Date(),
        updatedAt: new Date(),
      });
      return new Map(map);
    });

    this.saveStates();

    // Run onActivate hook
    if (config.hooks?.onActivate) {
      const context = this.createContext(pluginId);
      await config.hooks.onActivate(context);
    }
  }

  /**
   * Disable a plugin
   */
  async disablePlugin(pluginId: string): Promise<void> {
    const config = this.pluginConfigs().get(pluginId);
    if (!config) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // Run onDeactivate hook
    if (config.hooks?.onDeactivate) {
      const context = this.createContext(pluginId);
      await config.hooks.onDeactivate(context);
    }

    // Update state
    this.pluginStates.update(map => {
      const existing = map.get(pluginId);
      if (existing) {
        map.set(pluginId, {
          ...existing,
          enabled: false,
          updatedAt: new Date(),
        });
      }
      return new Map(map);
    });

    this.saveStates();
  }

  /**
   * Update plugin settings
   */
  async updatePluginSettings(pluginId: string, settings: Record<string, any>): Promise<void> {
    const config = this.pluginConfigs().get(pluginId);
    if (!config) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // Update state
    this.pluginStates.update(map => {
      const existing = map.get(pluginId);
      map.set(pluginId, {
        id: pluginId,
        enabled: existing?.enabled ?? true,
        settings,
        installedAt: existing?.installedAt ?? new Date(),
        updatedAt: new Date(),
      });
      return new Map(map);
    });

    this.saveStates();

    // Run onSettingsUpdate hook
    if (config.hooks?.onSettingsUpdate) {
      const context = this.createContext(pluginId);
      await config.hooks.onSettingsUpdate(settings, context);
    }
  }

  /**
   * Get plugin settings
   */
  getPluginSettings(pluginId: string): Record<string, any> {
    const context = this.createContext(pluginId);
    return context.getSettings();
  }

  /**
   * Execute a hook on all enabled plugins
   */
  async executeHook<K extends keyof PluginHooks>(
    hookName: K,
    ...args: Parameters<NonNullable<PluginHooks[K]>>
  ): Promise<any[]> {
    const results: any[] = [];

    for (const plugin of this.enabledPlugins()) {
      const config = this.pluginConfigs().get(plugin.id);
      const hook = config?.hooks?.[hookName];

      if (hook && typeof hook === 'function') {
        const context = this.createContext(plugin.id);
        try {
          // @ts-ignore - Dynamic hook execution
          const result = await hook(...args, context);
          results.push(result);
        } catch (error) {
          console.error(`Error executing ${hookName} on plugin ${plugin.id}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * Filter content through enabled plugins
   */
  async filterContent(
    content: string,
    filterName: 'filterPostContent' | 'filterPageContent',
    item: any
  ): Promise<string> {
    let filtered = content;

    for (const plugin of this.enabledPlugins()) {
      const config = this.pluginConfigs().get(plugin.id);
      const filter = config?.hooks?.[filterName];

      if (filter && typeof filter === 'function') {
        const context = this.createContext(plugin.id);
        try {
          filtered = await filter(filtered, item, context);
        } catch (error) {
          console.error(`Error filtering content with plugin ${plugin.id}:`, error);
        }
      }
    }

    return filtered;
  }

  /**
   * Get plugin config
   */
  getPluginConfig(pluginId: string): PluginConfig | undefined {
    return this.pluginConfigs().get(pluginId);
  }

  /**
   * Check if plugin is enabled
   */
  isPluginEnabled(pluginId: string): boolean {
    return this.enabledPlugins().some(p => p.id === pluginId);
  }

  /**
   * Save plugin states to localStorage
   */
  private saveStates(): void {
    if (typeof localStorage !== 'undefined') {
      const states = Object.fromEntries(this.pluginStates());
      localStorage.setItem('plugin-states', JSON.stringify(states));
    }
  }
}
