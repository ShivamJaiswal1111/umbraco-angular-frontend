import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SiteConfigService {

  private readonly siteMap: Record<string, { siteName: string; rootId: string }> = {
    'sitea.local': {
      siteName: 'Uniphar Pharmacy',
      rootId: 'd21afb47-1fa9-4be7-a813-a21ea4458c51'
    },
    'siteb.local': {
      siteName: 'Uniphar Retail',
      rootId: 'f8f45f36-e02c-48cb-8360-1cf2a70cf824'
    },
    'merged.local': {
        siteName: 'Uniphar Group',
        rootId: '33550bb3-1de9-400c-bbad-66134dcf2265'  
    },
    'localhost': {
      siteName: 'Uniphar Pharmacy',
      rootId: 'd21afb47-1fa9-4be7-a813-a21ea4458c51'
    }
  };

  readonly apiBaseUrl = environment.apiBaseUrl;

  getCurrentSite() {
    const host = window.location.hostname;
    return this.siteMap[host] ?? this.siteMap['localhost'];
  }

  getApiUrl(path: string): string {
    return `${this.apiBaseUrl}${path}`;
  }
}