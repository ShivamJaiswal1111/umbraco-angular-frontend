import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Umbraco } from '../../services/umbraco';
import { SiteConfigService } from '../../site-config.service';

@Component({
  selector: 'app-home',
  imports: [],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  title = signal('');
  body = signal('');
  siteName = signal('');
  legacyUrl = signal('');
  loading = signal(true);
  isMergedSite = signal(false);

  constructor(
    private umbracoService: Umbraco,
    private siteConfig: SiteConfigService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const host = window.location.hostname;
    const isMerged = host === 'merged.local';
    this.isMergedSite.set(isMerged);

    if (isMerged) {
      const segments = this.route.snapshot.url.map(s => s.path).filter(p => p);

      if (segments.length === 0) {
        // root route / → fetch merged root by ID
        this.umbracoService.getHome().subscribe({
          next: (data: any) => {
            this.title.set(data.properties.title ?? data.name);
            this.body.set(data.properties.body?.markup || '');
            this.siteName.set(data.properties.siteName || '');
            this.legacyUrl.set(data.properties.legacySourceUrl || '');
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error fetching merged home:', err);
            this.loading.set(false);
          }
        });
      } else {
        // sub-route like /home-site-a or /uniphar-retail-home-site-b
        const path = '/' + segments.join('/');
        this.umbracoService.getByPath(path).subscribe({
          next: (data: any) => {
            this.title.set(data.properties.title ?? data.name);
            this.body.set(data.properties.body?.markup || '');
            this.siteName.set(data.properties.siteName || '');
            this.legacyUrl.set(data.properties.legacySourceUrl || '');
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error fetching merged home:', err);
            this.loading.set(false);
          }
        });
      }
    } else {
      // sitea.local / siteb.local
      this.umbracoService.getHome().subscribe({
        next: (data: any) => {
          this.title.set(data.properties.title ?? data.name);
          this.body.set(data.properties.body?.markup || '');
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error fetching home:', err);
          this.loading.set(false);
        }
      });
    }
  }
}