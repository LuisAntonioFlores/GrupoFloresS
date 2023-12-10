import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavonepageComponent } from './navonepage.component';

describe('NavonepageComponent', () => {
  let component: NavonepageComponent;
  let fixture: ComponentFixture<NavonepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavonepageComponent]
    });
    fixture = TestBed.createComponent(NavonepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
