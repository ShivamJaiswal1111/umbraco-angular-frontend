import { TestBed } from '@angular/core/testing';
import { Umbraco } from './umbraco';

describe('Umbraco', () => {
  let service: Umbraco;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Umbraco);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
