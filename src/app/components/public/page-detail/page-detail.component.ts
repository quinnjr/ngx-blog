import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageService } from '../../../services/page.service';
import { SEOService } from '../../../services/seo.service';
import { Page } from '../../../models';

@Component({
  selector: 'app-page-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page-detail.component.html',
  styleUrls: ['./page-detail.component.css']
})
export class PageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pageService = inject(PageService);
  private seoService = inject(SEOService);

  page = signal<Page | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const page = this.pageService.getPageBySlug(slug);
      
      if (page) {
        this.page.set(page);
        
        // Update SEO meta tags
        this.seoService.updateTags(page.seo, `/${page.slug}`);
      }
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
}
