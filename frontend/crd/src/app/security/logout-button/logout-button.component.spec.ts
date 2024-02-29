import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LogoutButtonComponent } from './logout-button.component';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import {Role, User, UserJSON} from '../domain/user';

describe('LogoutButtonComponent', () => {
  let component: LogoutButtonComponent;
  let fixture: ComponentFixture<LogoutButtonComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const userJSON: UserJSON = {
    id: 'id',
    email: 'test@test.test',
    phoneNumber: '111-111-1111',
    dateCreated: 0,
    lastLogin: 0,
    firstName: 'test',
    lastName: 'test',
    preferredName: 'test',
    canEmail: false,
    canText: false,
    role: Role.Admin,
  }

  function setup(user: User | null) {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signOut'], {user$: of(user)});
    TestBed.configureTestingModule({
      declarations: [LogoutButtonComponent],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
      ],
    });
    fixture = TestBed.createComponent(LogoutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup(null);
    expect(component).toBeTruthy();
  });

  it('should load user if it exists', fakeAsync(() => {
    const user = new User(userJSON);
    setup(user);
    tick(1000);
    expect(component.user).toEqual(user);
  }));

  it('should not load user if does not exist', fakeAsync(() => {
    setup(null);
    tick(1000);
    expect(component.user).toEqual(User.makeEmpty());
  }));

  it('should sign out', () => {
    setup(null);
    component.logout();

    expect(authServiceSpy.signOut).toHaveBeenCalledTimes(1);
  });
});
