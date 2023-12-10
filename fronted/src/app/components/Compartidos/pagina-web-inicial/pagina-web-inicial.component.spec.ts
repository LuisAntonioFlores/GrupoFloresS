import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaWebInicialComponent } from './pagina-web-inicial.component';

describe('PaginaWebInicialComponent', () => {
  let component: PaginaWebInicialComponent;
  let fixture: ComponentFixture<PaginaWebInicialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaWebInicialComponent]
    });
    fixture = TestBed.createComponent(PaginaWebInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
