import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavbarComponent} from './navbar.component';
import {AppRoutingModule} from "../app-routing.module";
import {MatTabsModule} from "@angular/material/tabs";
import {AuthService} from "../security/auth.service";
import {map, Subject} from "rxjs";
import {Role, User, UserJSON} from "../security/domain/user";
import SpyObj = jasmine.SpyObj;

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let userSubject: Subject<UserJSON> = new Subject<UserJSON>();
  let user: UserJSON = {
    id: "string",
    email: "string",
    phoneNumber: "string",
    dateCreated: 1,
    lastLogin: 1,
    firstName: 'string',
    lastName: 'string',
    preferredName: 'string',
    canEmail: true,
    canText: true,
    role: Role.Student,
    profilePictureId: 0,
  }
  let authSvcSpy: SpyObj<AuthService> = jasmine.createSpyObj('AuthService', [],
    {user$: userSubject.pipe(map(userJson => new User(userJson)))});


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, MatTabsModule],
      providers: [
        {provide: AuthService, useValue: authSvcSpy},
      ],
      declarations: [NavbarComponent]
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have student Links', () => {
    userSubject.next({...user, role: Role.Student});
    expect(component.navLinks).toEqual(component.studentLinks);
  });

  it('should have faculty Links', () => {
    userSubject.next({...user, role: Role.Faculty});
    expect(component.navLinks).toEqual(component.facultyLinks);
  });

  it('should have student Links', () => {
    userSubject.next({...user, role: Role.Admin});
    expect(component.navLinks).toEqual(component.adminLinks);
  });
});
