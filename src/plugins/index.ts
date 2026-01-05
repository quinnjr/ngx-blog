/**
 * Plugin Registry
 *
 * Import your plugin configs here to make them available in the app
 * Just add a new import and the plugin will automatically be discovered!
 */

import analytics from './analytics/plugin.config';
import socialShare from './social-share/plugin.config';
import contactForm from './contact-form/plugin.config';

// Add your custom plugins here:
// import myCustomPlugin from './my-custom-plugin/plugin.config';

/**
 * All available plugins
 * Plugins are automatically registered when imported above
 */
export const plugins = [
  analytics,
  socialShare,
  contactForm,
  // Add your custom plugins to the array:
  // myCustomPlugin,
];

/**
 * Get plugin by ID
 */
export function getPluginById(id: string) {
  return plugins.find(plugin => plugin.metadata.id === id);
}

/**
 * Get all plugin IDs
 */
export function getPluginIds() {
  return plugins.map(plugin => plugin.metadata.id);
}

/**
 * Get plugins by category
 */
export function getPluginsByCategory(category: string) {
  return plugins.filter(plugin => plugin.metadata.category === category);
}
