import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeDetails } from './service-type-details';

describe('ServiceTypeDetails', () => {
  let component: ServiceTypeDetails;
  let fixture: ComponentFixture<ServiceTypeDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTypeDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceTypeDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
