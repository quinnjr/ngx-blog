import { definePlugin } from '../plugin.interface';

/**
 * Google Analytics Plugin
 *
 * Adds Google Analytics tracking to your blog
 */
export default definePlugin({
  metadata: {
    id: 'analytics',
    name: 'Google Analytics',
    version: '1.0.0',
    author: 'NGX Blog CMS',
    description: 'Add Google Analytics tracking to your blog',
    icon: 'chart-bar',
    category: 'analytics',
    homepage: 'https://analytics.google.com',
  },

  settings: [
    {
      key: 'trackingId',
      label: 'Tracking ID',
      type: 'text',
      required: true,
      helpText: 'Your Google Analytics tracking ID (e.g., G-XXXXXXXXXX)',
    },
    {
      key: 'anonymizeIp',
      label: 'Anonymize IP',
      type: 'boolean',
      defaultValue: true,
      helpText: 'Anonymize visitor IP addresses for GDPR compliance',
    },
    {
      key: 'trackOutboundLinks',
      label: 'Track Outbound Links',
      type: 'boolean',
      defaultValue: true,
      helpText: 'Track clicks on external links',
    },
  ],

  hooks: {
    onActivate: async (context) => {
      console.log('Analytics plugin activated');
      const settings = context.getSettings();

      if (!settings['trackingId']) {
        console.warn('Analytics: No tracking ID configured');
        return;
      }

      // Inject Google Analytics script
      if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${settings['trackingId']}`;
        document.head.appendChild(script);

        const configScript = document.createElement('script');
        configScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${settings['trackingId']}', {
            'anonymize_ip': ${settings['anonymizeIp'] || false}
          });
        `;
        document.head.appendChild(configScript);
      }
    },

    onDeactivate: async (context) => {
      console.log('Analytics plugin deactivated');
      // Remove Google Analytics scripts
      if (typeof window !== 'undefined') {
        const scripts = document.querySelectorAll('script[src*="googletagmanager"]');
        scripts.forEach(script => script.remove());
      }
    },

    afterPostPublish: async (post, context) => {
      const settings = context.getSettings();
      if (typeof window !== 'undefined' && (window as any).gtag && settings['trackingId']) {
        // Track page view
        (window as any).gtag('event', 'page_view', {
          page_title: post.title,
          page_location: window.location.href,
          page_path: `/post/${post.slug}`,
        });
      }
    },
  },
});
