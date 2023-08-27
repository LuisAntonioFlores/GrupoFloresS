import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatetasksComponent } from './privatetasks.component';

describe('PrivatetasksComponent', () => {
  let component: PrivatetasksComponent;
  let fixture: ComponentFixture<PrivatetasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivatetasksComponent]
    });
    fixture = TestBed.createComponent(PrivatetasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
