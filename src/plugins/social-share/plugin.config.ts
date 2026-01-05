import { definePlugin } from '../plugin.interface';

/**
 * Social Share Plugin
 *
 * Adds social media share buttons to posts and pages
 */
export default definePlugin({
  metadata: {
    id: 'social-share',
    name: 'Social Share Buttons',
    version: '1.0.0',
    author: 'NGX Blog CMS',
    description: 'Add social media share buttons to your posts and pages',
    icon: 'share-alt',
    category: 'social',
  },

  settings: [
    {
      key: 'enableFacebook',
      label: 'Enable Facebook',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'enableTwitter',
      label: 'Enable Twitter',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'enableLinkedIn',
      label: 'Enable LinkedIn',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'enableReddit',
      label: 'Enable Reddit',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'enableEmail',
      label: 'Enable Email',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'position',
      label: 'Button Position',
      type: 'select',
      defaultValue: 'bottom',
      options: [
        { label: 'Top of Post', value: 'top' },
        { label: 'Bottom of Post', value: 'bottom' },
        { label: 'Both', value: 'both' },
      ],
    },
    {
      key: 'style',
      label: 'Button Style',
      type: 'select',
      defaultValue: 'icon',
      options: [
        { label: 'Icons Only', value: 'icon' },
        { label: 'Text Only', value: 'text' },
        { label: 'Icons + Text', value: 'both' },
      ],
    },
  ],

  hooks: {
    onActivate: async (context) => {
      console.log('Social Share plugin activated');
    },

    filterPostContent: (content, post, context) => {
      const settings = context.getSettings();
      const shareButtons = generateShareButtons(post, settings);

      if (settings['position'] === 'top') {
        return shareButtons + content;
      } else if (settings['position'] === 'bottom') {
        return content + shareButtons;
      } else if (settings['position'] === 'both') {
        return shareButtons + content + shareButtons;
      }

      return content;
    },

    filterPageContent: (content, page, context) => {
      const settings = context.getSettings();
      const shareButtons = generateShareButtons(page, settings);

      if (settings['position'] === 'top') {
        return shareButtons + content;
      } else if (settings['position'] === 'bottom') {
        return content + shareButtons;
      } else if (settings['position'] === 'both') {
        return shareButtons + content + shareButtons;
      }

      return content;
    },
  },
});

function generateShareButtons(item: any, settings: any): string {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const title = encodeURIComponent(item.title || '');
  const buttons: string[] = [];

  if (settings['enableFacebook']) {
    buttons.push(`<a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" class="share-button share-facebook" aria-label="Share on Facebook">
      <i class="fab fa-facebook"></i> ${settings['style'] !== 'icon' ? 'Facebook' : ''}
    </a>`);
  }

  if (settings['enableTwitter']) {
    buttons.push(`<a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" target="_blank" class="share-button share-twitter" aria-label="Share on Twitter">
      <i class="fab fa-twitter"></i> ${settings['style'] !== 'icon' ? 'Twitter' : ''}
    </a>`);
  }

  if (settings['enableLinkedIn']) {
    buttons.push(`<a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" class="share-button share-linkedin" aria-label="Share on LinkedIn">
      <i class="fab fa-linkedin"></i> ${settings['style'] !== 'icon' ? 'LinkedIn' : ''}
    </a>`);
  }

  if (settings['enableReddit']) {
    buttons.push(`<a href="https://reddit.com/submit?url=${url}&title=${title}" target="_blank" class="share-button share-reddit" aria-label="Share on Reddit">
      <i class="fab fa-reddit"></i> ${settings['style'] !== 'icon' ? 'Reddit' : ''}
    </a>`);
  }

  if (settings['enableEmail']) {
    buttons.push(`<a href="mailto:?subject=${title}&body=${url}" class="share-button share-email" aria-label="Share via Email">
      <i class="fas fa-envelope"></i> ${settings['style'] !== 'icon' ? 'Email' : ''}
    </a>`);
  }

  return `<div class="social-share-buttons">${buttons.join('')}</div>`;
}
