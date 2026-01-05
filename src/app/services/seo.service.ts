import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SEOMetadata } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private meta = inject(Meta);
  private title = inject(Title);
  
  private readonly defaultTitle = 'NGX Blog CMS';
  private readonly defaultDescription = 'A modern Angular-based blogging platform';
  private readonly defaultImage = '/assets/og-image.png';
  private readonly siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  /**
   * Update all SEO meta tags for a page/post
   */
  updateTags(seo: SEOMetadata, url?: string): void {
    // Set page title
    const pageTitle = seo.metaTitle || this.defaultTitle;
    this.title.setTitle(pageTitle);

    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: seo.metaDescription || this.defaultDescription });
    
    if (seo.metaKeywords && seo.metaKeywords.length > 0) {
      this.meta.updateTag({ name: 'keywords', content: seo.metaKeywords.join(', ') });
    }

    // Canonical URL
    const canonicalUrl = seo.canonicalUrl || (url ? `${this.siteUrl}${url}` : this.siteUrl);
    this.updateLinkTag('canonical', canonicalUrl);

    // Robots meta
    const robotsContent = this.buildRobotsContent(seo.noIndex, seo.noFollow);
    if (robotsContent) {
      this.meta.updateTag({ name: 'robots', content: robotsContent });
    }

    // Open Graph tags
    this.updateOpenGraphTags(seo, canonicalUrl);

    // Twitter Card tags
    this.updateTwitterTags(seo);

    // Structured Data (JSON-LD)
    if (seo.structuredData) {
      this.updateStructuredData(seo.structuredData);
    }
  }

  /**
   * Generate structured data for a blog post
   */
  generateBlogPostStructuredData(
    title: string,
    description: string,
    author: { name: string; url?: string },
    publishedDate: Date,
    modifiedDate: Date,
    imageUrl?: string,
    url?: string
  ): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': title,
      'description': description,
      'author': {
        '@type': 'Person',
        'name': author.name,
        ...(author.url && { 'url': author.url })
      },
      'datePublished': publishedDate.toISOString(),
      'dateModified': modifiedDate.toISOString(),
      ...(imageUrl && {
        'image': {
          '@type': 'ImageObject',
          'url': imageUrl
        }
      }),
      ...(url && { 'url': `${this.siteUrl}${url}` }),
      'publisher': {
        '@type': 'Organization',
        'name': this.defaultTitle,
        'logo': {
          '@type': 'ImageObject',
          'url': `${this.siteUrl}/assets/logo.png`
        }
      }
    };
  }

  /**
   * Generate structured data for a website
   */
  generateWebsiteStructuredData(siteName: string, description: string): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': siteName,
      'description': description,
      'url': this.siteUrl,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${this.siteUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Generate structured data for an article
   */
  generateArticleStructuredData(
    title: string,
    description: string,
    author: { name: string },
    publishedDate: Date,
    keywords: string[],
    imageUrl?: string
  ): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': title,
      'description': description,
      'author': {
        '@type': 'Person',
        'name': author.name
      },
      'datePublished': publishedDate.toISOString(),
      'keywords': keywords.join(', '),
      ...(imageUrl && {
        'image': imageUrl
      }),
      'publisher': {
        '@type': 'Organization',
        'name': this.defaultTitle
      }
    };
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbStructuredData(items: { name: string; url: string }[]): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': `${this.siteUrl}${item.url}`
      }))
    };
  }

  /**
   * Clear all meta tags
   */
  clearTags(): void {
    this.title.setTitle(this.defaultTitle);
    
    const tags = [
      'description',
      'keywords',
      'robots',
      'og:title',
      'og:description',
      'og:image',
      'og:url',
      'og:type',
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'twitter:site',
      'twitter:creator'
    ];

    tags.forEach(tag => {
      if (tag.startsWith('og:') || tag.startsWith('twitter:')) {
        this.meta.removeTag(`property='${tag}'`);
        this.meta.removeTag(`name='${tag}'`);
      } else {
        this.meta.removeTag(`name='${tag}'`);
      }
    });

    this.removeStructuredData();
  }

  /**
   * Update Open Graph tags
   */
  private updateOpenGraphTags(seo: SEOMetadata, url: string): void {
    const ogTitle = seo.ogTitle || seo.metaTitle || this.defaultTitle;
    const ogDescription = seo.ogDescription || seo.metaDescription || this.defaultDescription;
    const ogImage = seo.ogImage || this.defaultImage;
    const ogType = seo.ogType || 'website';

    this.meta.updateTag({ property: 'og:title', content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDescription });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: ogType });
    this.meta.updateTag({ property: 'og:site_name', content: this.defaultTitle });
  }

  /**
   * Update Twitter Card tags
   */
  private updateTwitterTags(seo: SEOMetadata): void {
    const twitterCard = seo.twitterCard || 'summary_large_image';
    const twitterTitle = seo.ogTitle || seo.metaTitle || this.defaultTitle;
    const twitterDescription = seo.ogDescription || seo.metaDescription || this.defaultDescription;
    const twitterImage = seo.ogImage || this.defaultImage;

    this.meta.updateTag({ name: 'twitter:card', content: twitterCard });
    this.meta.updateTag({ name: 'twitter:title', content: twitterTitle });
    this.meta.updateTag({ name: 'twitter:description', content: twitterDescription });
    this.meta.updateTag({ name: 'twitter:image', content: twitterImage });

    if (seo.twitterSite) {
      this.meta.updateTag({ name: 'twitter:site', content: seo.twitterSite });
    }

    if (seo.twitterCreator) {
      this.meta.updateTag({ name: 'twitter:creator', content: seo.twitterCreator });
    }
  }

  /**
   * Update structured data (JSON-LD)
   */
  private updateStructuredData(data: any): void {
    // Remove existing structured data
    this.removeStructuredData();

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Remove structured data
   */
  private removeStructuredData(): void {
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }
  }

  /**
   * Update link tag (e.g., canonical)
   */
  private updateLinkTag(rel: string, href: string): void {
    let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', href);
  }

  /**
   * Build robots meta content
   */
  private buildRobotsContent(noIndex?: boolean, noFollow?: boolean): string | null {
    const directives: string[] = [];
    
    if (noIndex) directives.push('noindex');
    if (noFollow) directives.push('nofollow');
    
    if (directives.length === 0) {
      directives.push('index', 'follow');
    }
    
    return directives.join(', ');
  }

  /**
   * Generate sitemap URL list
   */
  generateSitemapUrls(
    posts: { slug: string; updatedAt: Date }[],
    pages: { slug: string; updatedAt: Date }[]
  ): any[] {
    const urls: any[] = [];

    // Homepage
    urls.push({
      loc: this.siteUrl,
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString()
    });

    // Posts
    posts.forEach(post => {
      urls.push({
        loc: `${this.siteUrl}/post/${post.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: post.updatedAt.toISOString()
      });
    });

    // Pages
    pages.forEach(page => {
      urls.push({
        loc: `${this.siteUrl}/${page.slug}`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: page.updatedAt.toISOString()
      });
    });

    return urls;
  }
}
