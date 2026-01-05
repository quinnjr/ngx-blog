/**
 * Theme Registry
 *
 * Import your theme configs here to make them available in the app
 * Just add a new import and the theme will automatically be discovered!
 */

import modernLight from './modern-light/theme.config';
import modernDark from './modern-dark/theme.config';
import minimal from './minimal/theme.config';

// Add your custom themes here:
// import myCustomTheme from './my-custom-theme/theme.config';

/**
 * All available themes
 * Themes are automatically registered when imported above
 */
export const themes = [
  modernLight,
  modernDark,
  minimal,
  // Add your custom themes to the array:
  // myCustomTheme,
];

/**
 * Get theme by ID
 */
export function getThemeById(id: string) {
  return themes.find(theme => theme.id === id);
}

/**
 * Get all theme IDs
 */
export function getThemeIds() {
  return themes.map(theme => theme.id);
}
