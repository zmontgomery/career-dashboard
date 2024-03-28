import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPageComponent } from './signup-page.component';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { User } from '../domain/user';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { userJSON } from '../auth.service.spec';
import { OswegoLogoModule } from 'src/app/oswego-logo/oswego-logo.module';
import { MockComponent } from 'ng-mocks';
import { OswegoLogoComponent } from 'src/app/oswego-logo/oswego-logo.component';

describe('SignupPageComponent', () => {
  let component: SignupPageComponent;
  let fixture: ComponentFixture<SignupPageComponent>;

  let authService: jasmine.SpyObj<AuthService>;

  const user = new User(userJSON);

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['signup', 'signOut'], {user$: of(user)});

    TestBed.configureTestingModule({
      declarations: [SignupPageComponent, MockComponent(OswegoLogoComponent)],
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatIconModule,
        BrowserAnimationsModule,
        OswegoLogoModule
      ],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: FormBuilder, useValue: new FormBuilder()}
      ]
    });
    fixture = TestBed.createComponent(SignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.canEmail).toBeTrue();
    expect(component.canText).toBeTrue();
    expect(component.canEmailControl.getRawValue()).toBeTrue();
    expect(component.canTextControl.getRawValue()).toBeTrue();
  });

  it('should have user', async () => {
    await fixture.whenStable();

    expect(component.user).toEqual(user);
  });

  it('should set preffered name', async () => {
    await fixture.whenStable();

    component.preferredNameControl.setValue('hello');

    expect(component.preferredName).toEqual('hello');
  });

  it('should set can text', async () => {
    await fixture.whenStable();

    component.canTextControl.setValue(false);

    expect(component.canText).toBeFalse();
  });

  it('should set can email', async () => {
    await fixture.whenStable();

    component.canEmailControl.setValue(false);

    expect(component.canEmail).toBeFalse();
  });

  it('should format phone number properley', async () => {
    await fixture.whenStable();

    component.phoneNumberControl.setValue('1234567890');

    const foramtted = fixture.elementRef.nativeElement.getElementsByClassName('phone-field')[0].value;

    expect(foramtted).toEqual('(123)-456-7890');
    expect(component.phoneNumber).toEqual('123-456-7890');
  });

  it ('should call sign out on cancel', () => {
    component.onCancel();

    expect(authService.signOut).toHaveBeenCalled();
  });

  it ('should call sign out on submit', () => {
    component.onSubmit();

    expect(authService.signup).toHaveBeenCalled();
  });
});
