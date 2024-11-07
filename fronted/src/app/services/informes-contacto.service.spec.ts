import { TestBed } from '@angular/core/testing';

import { InformesContactoService } from './informes-contacto.service';

describe('InformesContactoService', () => {
  let service: InformesContactoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformesContactoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
