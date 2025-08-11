import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCreation } from './reservation-creation';

describe('ReservationCreation', () => {
  let component: ReservationCreation;
  let fixture: ComponentFixture<ReservationCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCreation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCreation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
