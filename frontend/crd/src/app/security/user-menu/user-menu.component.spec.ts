import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserMenuComponent } from './user-menu.component';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import {Role, User, UserJSON} from '../domain/user';
import {Router} from "@angular/router";
import {ArtifactService} from "../../file-upload/artifact.service";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let artifactSvcSpy: jasmine.SpyObj<ArtifactService>;

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
    profilePictureId: 0,
  }

  function setup(user: User | null) {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signOut'], {user$: of(user)});
    artifactSvcSpy = jasmine.createSpyObj('ArtifactService', ['getProfilePicture']);
    artifactSvcSpy.getProfilePicture.and.returnValue(of("testURL"))
    TestBed.configureTestingModule({
      declarations: [UserMenuComponent],
      imports: [MatMenuModule, MatIconModule],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ArtifactService, useValue: artifactSvcSpy},
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
});
