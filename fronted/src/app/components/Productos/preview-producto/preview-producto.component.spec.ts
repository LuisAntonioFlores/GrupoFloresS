import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewProductoComponent } from './preview-producto.component';

describe('PreviewProductoComponent', () => {
  let component: PreviewProductoComponent;
  let fixture: ComponentFixture<PreviewProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewProductoComponent]
    });
    fixture = TestBed.createComponent(PreviewProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
