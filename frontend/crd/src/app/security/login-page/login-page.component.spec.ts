import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { GoogleSigninButtonModule, SocialAuthService, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let socialAuthServiceSpy: jasmine.SpyObj<SocialAuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['loginRedirectMS']);
    socialAuthServiceSpy = jasmine.createSpyObj('SocialAuthService', ['toString'], {initState: of(false), authState: of(null)});
    TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [
        GoogleSigninButtonModule,
        CommonModule,
        MatCardModule,
        MatButtonModule
      ],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: SocialAuthService, useValue: socialAuthServiceSpy},
      ]
    });
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect', () => {
    component.ms();

    expect(authServiceSpy.loginRedirectMS).toHaveBeenCalledTimes(1);
  });
});
