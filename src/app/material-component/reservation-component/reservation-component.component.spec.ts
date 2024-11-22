import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationComponentComponent } from './reservation-component.component';

describe('ReservationComponentComponent', () => {
  let component: ReservationComponentComponent;
  let fixture: ComponentFixture<ReservationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
