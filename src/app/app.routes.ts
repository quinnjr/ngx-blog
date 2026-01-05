import { Routes } from '@angular/router';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./components/public/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/public/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'post/:slug',
        loadComponent: () => import('./components/public/post-detail/post-detail.component').then(m => m.PostDetailComponent)
      },
      {
        path: ':slug',
        loadComponent: () => import('./components/public/page-detail/page-detail.component').then(m => m.PageDetailComponent)
      }
    ]
  },
  // Admin routes
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'posts',
        loadComponent: () => import('./components/admin/posts/posts-list.component').then(m => m.PostsListComponent)
      },
      {
        path: 'posts/new',
        loadComponent: () => import('./components/admin/posts/post-editor.component').then(m => m.PostEditorComponent)
      },
      {
        path: 'posts/edit/:id',
        loadComponent: () => import('./components/admin/posts/post-editor.component').then(m => m.PostEditorComponent)
      },
      {
        path: 'pages',
        loadComponent: () => import('./components/admin/pages/pages-list.component').then(m => m.PagesListComponent)
      },
      {
        path: 'page-builder',
        loadComponent: () => import('./components/admin/page-builder/page-builder.component').then(m => m.PageBuilderComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/admin/categories/categories-list.component').then(m => m.CategoriesListComponent)
      },
      {
        path: 'themes',
        loadComponent: () => import('./components/admin/themes/themes-list.component').then(m => m.ThemesListComponent)
      },
      {
        path: 'plugins',
        loadComponent: () => import('./components/admin/plugins/plugins-list.component').then(m => m.PluginsListComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/admin/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  // Catch-all redirect
  {
    path: '**',
    redirectTo: ''
  }
];
