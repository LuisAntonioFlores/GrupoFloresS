import { TestBed } from '@angular/core/testing';

import { ProductSubirService } from './product-subir.service';

describe('ProductSubirService', () => {
  let service: ProductSubirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSubirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
