import { definePlugin } from '../plugin.interface';

/**
 * Contact Form Plugin
 *
 * Adds a contact form to your blog
 */
export default definePlugin({
  metadata: {
    id: 'contact-form',
    name: 'Contact Form',
    version: '1.0.0',
    author: 'NGX Blog CMS',
    description: 'Add a contact form to your blog with email notifications',
    icon: 'envelope',
    category: 'content',
  },

  settings: [
    {
      key: 'recipientEmail',
      label: 'Recipient Email',
      type: 'text',
      required: true,
      helpText: 'Email address where form submissions will be sent',
    },
    {
      key: 'subjectPrefix',
      label: 'Email Subject Prefix',
      type: 'text',
      defaultValue: '[Contact Form]',
      helpText: 'Prefix added to email subject lines',
    },
    {
      key: 'enableCaptcha',
      label: 'Enable CAPTCHA',
      type: 'boolean',
      defaultValue: false,
      helpText: 'Require CAPTCHA verification to prevent spam',
    },
    {
      key: 'successMessage',
      label: 'Success Message',
      type: 'textarea',
      defaultValue: 'Thank you for your message! We will get back to you soon.',
      helpText: 'Message shown after successful submission',
    },
    {
      key: 'enableFileUpload',
      label: 'Enable File Uploads',
      type: 'boolean',
      defaultValue: false,
      helpText: 'Allow users to attach files to their messages',
    },
    {
      key: 'maxFileSize',
      label: 'Max File Size (MB)',
      type: 'number',
      defaultValue: 5,
      helpText: 'Maximum file size for uploads',
    },
  ],

  hooks: {
    onActivate: async (context) => {
      console.log('Contact Form plugin activated');
      const settings = context.getSettings();

      if (!settings['recipientEmail']) {
        console.warn('Contact Form: No recipient email configured');
      }
    },

    onInit: async (context) => {
      // Register custom route for contact form submissions
      if (context.registerRoute) {
        context.registerRoute({
          path: 'contact',
          component: 'ContactFormComponent',
        });
      }
    },
  },

  adminMenuItems: [
    {
      label: 'Contact Messages',
      icon: 'envelope',
      route: '/admin/contact-messages',
      order: 50,
    },
  ],
});
