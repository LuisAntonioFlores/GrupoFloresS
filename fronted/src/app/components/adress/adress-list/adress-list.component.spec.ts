import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressListComponent } from './adress-list.component';

describe('AdressListComponent', () => {
  let component: AdressListComponent;
  let fixture: ComponentFixture<AdressListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdressListComponent]
    });
    fixture = TestBed.createComponent(AdressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
