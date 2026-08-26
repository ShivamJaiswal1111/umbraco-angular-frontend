import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Umbraco } from '../../services/umbraco';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact implements OnInit {
  intro = signal('');
  loading = signal(true);

  name = '';
  email = '';
  message = '';

  successMessage = signal('');
  errorMessage = signal('');
  submitting = signal(false);

  constructor(private umbracoService: Umbraco) {}

  ngOnInit() {
    this.umbracoService.getContact().subscribe({
      next: (data: any) => {
      const page = data.items?.[0];
      if (page) {
        this.intro.set(page.properties.intro || '');
      }
      this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching contact page:', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (!this.name.trim() || !this.email.trim() || !this.message.trim()) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.submitting.set(true);
    this.umbracoService.submitContactForm(this.name, this.email, this.message).subscribe({
      next: (res: any) => {
        this.successMessage.set(res.message || 'Thanks! Your message has been sent.');
        this.name = '';
        this.email = '';
        this.message = '';
        this.submitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Something went wrong. Please try again.');
        this.submitting.set(false);
      }
    });
  }
}