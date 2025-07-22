import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthApp } from './auth-app';

describe('AuthApp', () => {
  let component: AuthApp;
  let fixture: ComponentFixture<AuthApp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthApp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
