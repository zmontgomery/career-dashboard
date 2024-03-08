import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserMenuComponent } from './user-menu.component';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { User} from '../domain/user';
import {Router} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import { userJSON } from '../auth.service.spec';
import {UserService} from "../user.service";

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userSvcSpy: jasmine.SpyObj<UserService>;

  function setup(user: User | null) {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signOut'], {user$: of(user)});
    userSvcSpy = jasmine.createSpyObj('ArtifactService', ['getProfilePicture']);
    userSvcSpy.getProfilePicture.and.returnValue(of("testURL"))
    routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    TestBed.configureTestingModule({
      declarations: [UserMenuComponent],
      imports: [MatMenuModule, MatIconModule],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: UserService, useValue: userSvcSpy},
      ],
    });
    fixture = TestBed.createComponent(UserMenuComponent);
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

  it('should open settings', () => {
    setup(null);
    routerSpy.navigate.and.returnValue(Promise.resolve(true))
    component.openSettings();

    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
  });

  it('should open settings error', () => {
    setup(null);
    routerSpy.navigate.and.returnValue(Promise.resolve(false))
    component.openSettings();

    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
  });

});
