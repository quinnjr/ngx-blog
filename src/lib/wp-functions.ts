/**
 * WordPress-Compatible Functions
 *
 * Provides WordPress-style functions for settings management
 * Makes it easy for WordPress developers to work with NGX Blog
 */

import { SettingsLoader } from './settings-loader';

/**
 * Retrieve option value based on option name.
 *
 * WordPress equivalent: get_option()
 *
 * @param option Name of option to retrieve
 * @param defaultValue Optional default value if option doesn't exist
 * @returns Option value or default
 */
export function get_option<T = any>(option: string, defaultValue?: T): T {
  return SettingsLoader.get_option(option, defaultValue);
}

/**
 * Update the value of an option that was already added.
 *
 * WordPress equivalent: update_option()
 *
 * Note: This only updates the cache. For database updates, use the API.
 *
 * @param option Option name
 * @param value Option value
 */
export function update_option(option: string, value: any): void {
  SettingsLoader.update_option(option, value);
}

/**
 * Removes option by name.
 *
 * WordPress equivalent: delete_option()
 *
 * Note: This only updates the cache. For database updates, use the API.
 *
 * @param option Option name
 */
export function delete_option(option: string): void {
  SettingsLoader.delete_option(option);
}

/**
 * Get site URL
 *
 * WordPress equivalent: get_site_url() or site_url()
 */
export function get_site_url(): string {
  return get_option('siteurl', 'http://localhost:4000');
}

/**
 * Get home URL (same as site URL in our system)
 *
 * WordPress equivalent: get_home_url() or home_url()
 */
export function get_home_url(): string {
  return get_site_url();
}

/**
 * Get blog name
 *
 * WordPress equivalent: get_bloginfo('name')
 */
export function get_bloginfo_name(): string {
  return get_option('blogname', 'My Blog');
}

/**
 * Get blog description
 *
 * WordPress equivalent: get_bloginfo('description')
 */
export function get_bloginfo_description(): string {
  return get_option('blogdescription', '');
}

/**
 * Get blog info by key
 *
 * WordPress equivalent: get_bloginfo()
 *
 * @param show What to show (name, description, url, etc.)
 */
export function get_bloginfo(show: string = 'name'): string {
  switch (show) {
    case 'name':
      return get_bloginfo_name();
    case 'description':
      return get_bloginfo_description();
    case 'url':
    case 'wpurl':
    case 'siteurl':
      return get_site_url();
    case 'admin_email':
      return get_option('admin_email', '');
    case 'language':
      return get_option('WPLANG', 'en');
    default:
      return '';
  }
}

/**
 * Check if comments are open
 *
 * WordPress equivalent: comments_open()
 */
export function comments_open(): boolean {
  return get_option('default_comment_status', true);
}

/**
 * Get posts per page
 *
 * WordPress equivalent: get_option('posts_per_page')
 */
export function get_posts_per_page(): number {
  return get_option('posts_per_page', 10);
}

/**
 * Check if option exists
 *
 * @param option Option name
 */
export function option_exists(option: string): boolean {
  const value = get_option(option);
  return value !== undefined && value !== null;
}

/**
 * Get all options (not recommended for production, use sparingly)
 *
 * WordPress doesn't have direct equivalent (would be database query)
 */
export function get_all_options(): Record<string, any> {
  return SettingsLoader.getAll();
}

// Export SettingsLoader for advanced use
export { SettingsLoader };
