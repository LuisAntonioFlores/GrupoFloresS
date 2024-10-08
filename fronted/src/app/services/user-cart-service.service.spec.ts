import { TestBed } from '@angular/core/testing';

import { UserCartServiceService } from './user-cart-service.service';

describe('UserCartServiceService', () => {
  let service: UserCartServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCartServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
