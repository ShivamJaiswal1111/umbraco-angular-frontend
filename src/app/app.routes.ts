import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { BlogListing } from './pages/blog-listing/blog-listing';
import { BlogPost } from './pages/blog-post/blog-post';
import { Contact } from './pages/contact/contact';
import { RedirectGuard } from './redirect-guard';


export const routes: Routes = [
  // ── standard routes ──
  { path: '', component: Home },
  { path: 'blog', component: BlogListing },
  { path: 'blog/:slug', component: BlogPost },
  { path: 'contact', component: Contact },

  // ── old routes → redirect via guard ──
  { path: 'blog-posts', canActivate: [RedirectGuard], component: BlogListing },
  { path: 'blog-posts/:slug', canActivate: [RedirectGuard], component: BlogListing },

  // ── merged site routes ──
  { path: 'home-site-a', component: Home },
  { path: 'home-site-a/blog-posts-site-a', component: BlogListing },
  { path: 'home-site-a/blog-posts-site-a/:slug', component: BlogPost },
  { path: 'home-site-a/contact-site-a', component: Contact },
  { path: 'uniphar-retail-home-site-b', component: Home },
  { path: 'uniphar-retail-home-site-b/blog-posts-site-b', component: BlogListing },
  { path: 'uniphar-retail-home-site-b/blog-posts-site-b/:slug', component: BlogPost },
  { path: 'uniphar-retail-home-site-b/contact-site-b', component: Contact },
];