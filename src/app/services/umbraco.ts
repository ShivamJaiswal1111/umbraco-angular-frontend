import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteConfigService } from '../site-config.service';

@Injectable({
  providedIn: 'root'
})
export class Umbraco {

  constructor(
    private http: HttpClient,
    private siteConfig: SiteConfigService
  ) {}

  private get baseUrl() {
    return `${this.siteConfig.apiBaseUrl}/umbraco/delivery/api/v2`;
  }

  private get rootId() {
    return this.siteConfig.getCurrentSite().rootId;
  }

  getHome() {
    return this.http.get(`${this.baseUrl}/content/item/${this.rootId}`);
  }

  getBlogListing() {
    return this.http.get(
      `${this.baseUrl}/content?fetch=children:${this.rootId}&filter=contentType:blogListing`
    );
  }

  getBlogPosts() {
    return this.http.get(
      `${this.baseUrl}/content?fetch=descendants:${this.rootId}&filter=contentType:blogPost`
    );
  }

  getBlogPost(slug: string) {
    return this.http.get(`${this.baseUrl}/content/item/${slug}`);
  }

  getContact() {
    return this.http.get(
      `${this.baseUrl}/content?fetch=children:${this.rootId}&filter=contentType:contactPage`
    );
  }

  submitContactForm(name: string, email: string, message: string) {
    return this.http.post(
      `${this.siteConfig.apiBaseUrl}/api/contact`,
      { name, email, message }
    );
  }

  createBlogPost(post: {
    title: string;
    author: string;
    publishDate: string;
    body: string;
    parentListingId: string;
  }) {
    return this.http.post(
      `${this.siteConfig.apiBaseUrl}/api/blog`,
      post
    );
  }

  // getMergedChildren() {
  //   return this.http.get(
  //     `${this.baseUrl}/content?fetch=children:${this.rootId}`
  //   );
  // }

  getMergedDescendants() {
    return this.http.get(
      `${this.baseUrl}/content?fetch=descendants:${this.rootId}`
    );
  }

  getMergedPage(path: string) {
    return this.http.get(`${this.baseUrl}/content/item/${path}`);
  }
  getByPath(path: string) {
    return this.http.get(
      `${this.baseUrl}/content/item/${path}`
    );
  }

  getMergedChildren(parentPath: string) {
    return this.http.get(
      `${this.baseUrl}/content?fetch=children:${parentPath}`
    );
  }
}