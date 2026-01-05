/**
 * Simple Plugin System Interface
 *
 * Create a plugin.config.ts file in your plugin folder with this structure
 */

import { Injectable, Type } from '@angular/core';

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  homepage?: string;
  icon?: string;
  category?: 'content' | 'marketing' | 'analytics' | 'social' | 'seo' | 'utility' | 'other';
}

/**
 * Plugin settings schema
 */
export interface PluginSetting {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color';
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  required?: boolean;
  helpText?: string;
}

/**
 * Plugin hooks for lifecycle events
 */
export interface PluginHooks {
  /**
   * Called when plugin is initialized
   */
  onInit?: (context: PluginContext) => void | Promise<void>;

  /**
   * Called when plugin is activated
   */
  onActivate?: (context: PluginContext) => void | Promise<void>;

  /**
   * Called when plugin is deactivated
   */
  onDeactivate?: (context: PluginContext) => void | Promise<void>;

  /**
   * Called when plugin settings are updated
   */
  onSettingsUpdate?: (settings: Record<string, any>, context: PluginContext) => void | Promise<void>;

  /**
   * Called before a post is published
   */
  beforePostPublish?: (post: any, context: PluginContext) => any | Promise<any>;

  /**
   * Called after a post is published
   */
  afterPostPublish?: (post: any, context: PluginContext) => void | Promise<void>;

  /**
   * Called when rendering post content (modify HTML)
   */
  filterPostContent?: (content: string, post: any, context: PluginContext) => string | Promise<string>;

  /**
   * Called when rendering page content (modify HTML)
   */
  filterPageContent?: (content: string, page: any, context: PluginContext) => string | Promise<string>;
}

/**
 * Plugin context - access to CMS services and data
 */
export interface PluginContext {
  /**
   * Get plugin settings
   */
  getSettings: () => Record<string, any>;

  /**
   * Update plugin settings
   */
  updateSettings: (settings: Record<string, any>) => Promise<void>;

  /**
   * Access to CMS services (injected at runtime)
   */
  services: {
    posts?: any;
    pages?: any;
    categories?: any;
    themes?: any;
    seo?: any;
  };

  /**
   * Register a custom route
   */
  registerRoute?: (route: any) => void;

  /**
   * Add item to admin menu
   */
  addAdminMenuItem?: (item: AdminMenuItem) => void;
}

/**
 * Admin menu item
 */
export interface AdminMenuItem {
  label: string;
  icon?: string;
  route: string;
  order?: number;
}

/**
 * Widget configuration for admin dashboard
 */
export interface PluginWidget {
  id: string;
  title: string;
  component: Type<any>;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Complete plugin configuration
 */
export interface PluginConfig {
  metadata: PluginMetadata;
  settings?: PluginSetting[];
  hooks?: PluginHooks;
  widgets?: PluginWidget[];
  adminMenuItems?: AdminMenuItem[];
  routes?: any[];
  enabled?: boolean;
}

/**
 * Helper to define a plugin with type safety
 */
export function definePlugin(config: PluginConfig): PluginConfig {
  return {
    ...config,
    enabled: config.enabled ?? true,
  };
}

/**
 * Plugin state in database/storage
 */
export interface PluginState {
  id: string;
  enabled: boolean;
  settings: Record<string, any>;
  installedAt: Date;
  updatedAt: Date;
}
