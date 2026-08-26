import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Umbraco } from '../../services/umbraco';

@Component({
  selector: 'app-blog-post',
  imports: [CommonModule],
  styleUrl: './blog-post.css',
  templateUrl: './blog-post.html',
})
export class BlogPost implements OnInit {
  title = signal('');
  author = signal('');
  publishDate = signal('');
  body = signal('');
  loading = signal(true);

  constructor(private route: ActivatedRoute, private umbracoService: Umbraco) {}

  ngOnInit() {
    const isMerged = window.location.hostname === 'merged.local';

    let slug = this.route.snapshot.paramMap.get('slug') || '';

    if (isMerged) {
      // Build full path from the URL segments instead of just the last slug
      // e.g. /home-site-a/blog-posts-site-a/blog-post-1-site-a
      const segments = this.route.snapshot.url.map(s => s.path);
      slug = '/' + segments.join('/');
    }

    this.umbracoService.getBlogPost(slug).subscribe({
      next: (data: any) => {
        this.title.set(data.properties.title);
        this.author.set(data.properties.author);
        this.publishDate.set(data.properties.publishDate);
        this.body.set(data.properties.body?.markup || '');
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching blog post:', err);
        this.loading.set(false);
      }
    });
  }
}