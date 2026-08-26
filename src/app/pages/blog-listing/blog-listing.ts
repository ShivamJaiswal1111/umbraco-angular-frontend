import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Umbraco } from '../../services/umbraco';
import { SiteConfigService } from '../../site-config.service';

@Component({
  selector: 'app-blog-listing',
  imports: [FormsModule, RouterLink],
  styleUrl: './blog-listing.css',
  templateUrl: './blog-listing.html',
})
export class BlogListing implements OnInit {
  intro = signal('');
  posts = signal<any[]>([]);
  loading = signal(true);
  blogListingId = signal('');  // ← added

  title = signal('');
  author = signal('');
  publishDate = signal('');
  body = signal('');
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private umbracoService: Umbraco,
    private siteConfig: SiteConfigService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const isMerged = window.location.hostname === 'merged.local';

    if (isMerged) {
      const segments = this.route.snapshot.url.map(s => s.path).filter(p => p);
      const path = '/' + segments.join('/');

      if (segments.length === 0 || (!path.includes('site-a') && !path.includes('site-b'))) {
        this.loading.set(false);
        return;
      }

      this.umbracoService.getByPath(path).subscribe({
        next: (data: any) => {
          this.intro.set(data.properties.intro || data.properties.title || '');
          this.blogListingId.set(data.id);  // ← capture listing node ID
        },
        error: (err) => console.error(err)
      });
    } else {
      this.umbracoService.getBlogListing().subscribe({
        next: (data: any) => {
          const page = data.items?.[0];
          if (page) {
            this.intro.set(page.properties.intro || '');
            this.blogListingId.set(page.id);  // ← capture listing node ID
          }
        },
        error: (err) => console.error(err)
      });
    }

    this.loadPosts();
  }

  loadPosts() {
    const isMerged = window.location.hostname === 'merged.local';

    if (isMerged) {
      const segments = this.route.snapshot.url.map(s => s.path).filter(p => p);
      const path = '/' + segments.join('/');

      this.umbracoService.getMergedChildren(path).subscribe({
        next: (data: any) => {
          const posts = (data.items || []).map((post: any) => ({
            ...post,
            slug: post.route?.path?.split('/').filter((p: string) => p).pop() || ''
          }));
          this.posts.set(posts);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        }
      });
    } else {
      this.umbracoService.getBlogPosts().subscribe({
        next: (data: any) => {
          const posts = (data.items || []).map((post: any) => ({
            ...post,
            slug: post.route?.path?.split('/').filter((p: string) => p).pop() || ''
          }));
          this.posts.set(posts);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        }
      });
    }
  }

  getPostLink(post: any): string[] {
    const path = post.route?.path || '';
    const segments = path.split('/').filter((p: string) => p);
    return ['/', ...segments];
  }

  onCreatePost() {
    this.umbracoService.createBlogPost({
      title: this.title(),
      author: this.author(),
      publishDate: this.publishDate(),
      body: this.body(),
      parentListingId: this.blogListingId()  // ← uses listing ID not root ID
    }).subscribe({
      next: (res: any) => {
        this.successMessage.set(res.message || 'Post created!');
        this.errorMessage.set('');
        this.title.set('');
        this.author.set('');
        this.publishDate.set('');
        this.body.set('');
        this.loadPosts();
      },
      error: (err) => {
        this.errorMessage.set('Failed to create post.');
        console.error(err);
      }
    });
  }
}