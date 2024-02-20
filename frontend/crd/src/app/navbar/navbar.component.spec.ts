import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import {AppRoutingModule} from "../app-routing.module";
import {MatTabsModule} from "@angular/material/tabs";
import SpyObj = jasmine.SpyObj;
import {AuthService} from "../security/auth.service";
import {Subject} from "rxjs";
import {User} from "../security/domain/user";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let userSubject: Subject<User> = new Subject<User>();
  let user: User = {
    id: "string",
    email: "string",
    phoneNumber: "string",
    dateCreated: new Date(),
    lastLogin: new Date(),
    firstName: 'string',
    lastName: 'string',
    canEmail: true,
    canText: true,
    student: true,
    admin: false,
    faculty: false,
  }
  let authSvcSpy: SpyObj<AuthService> = jasmine.createSpyObj('AuthService', [],
    {user$: userSubject});


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
    userSubject.next(user);
    expect(component.navLinks).toEqual(component.studentLinks);
  });

  it('should have faculty Links', () => {
    userSubject.next({...user, faculty: true});
    expect(component.navLinks).toEqual(component.facultyLinks);
  });

  it('should have student Links', () => {
    userSubject.next({...user, admin: true});
    expect(component.navLinks).toEqual(component.adminLinks);
  });
});
