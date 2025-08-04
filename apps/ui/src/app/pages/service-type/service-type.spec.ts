import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceType } from './service-type';

describe('ServiceType', () => {
  let component: ServiceType;
  let fixture: ComponentFixture<ServiceType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
