import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const host = window.location.hostname;
    const slug = route.paramMap.get('slug') || '';

    if (host === 'sitea.local') {
      if (slug) {
        this.router.navigate(['/home-site-a/blog-posts-site-a/' + slug + '-site-a']);
      } else {
        this.router.navigate(['/home-site-a/blog-posts-site-a']);
      }
    } else if (host === 'siteb.local') {
      if (slug) {
        this.router.navigate(['/uniphar-retail-home-site-b/blog-posts-site-b/' + slug + '-site-b']);
      } else {
        this.router.navigate(['/uniphar-retail-home-site-b/blog-posts-site-b']);
      }
    }

    return false;
  }
}