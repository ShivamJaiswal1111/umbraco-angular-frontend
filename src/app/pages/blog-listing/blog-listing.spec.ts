import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogListing } from './blog-listing';

describe('BlogListing', () => {
  let component: BlogListing;
  let fixture: ComponentFixture<BlogListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogListing],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
