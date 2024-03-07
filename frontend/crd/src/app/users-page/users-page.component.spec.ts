import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { UsersPageComponent } from './users-page.component';
import {ScreenSizeService} from "../util/screen-size.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of} from "rxjs";
import {UsersSearchResponse} from "./user-search-result";
import {User} from "../security/domain/user";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import { UserService } from '../security/user.service';
import { AuthService } from '../security/auth.service';
import { userJSON } from '../security/auth.service.spec';
import { MockComponent } from 'ng-mocks';
import { EditRoleMenuComponent } from './edit-role-menu/edit-role-menu.component';

describe('UsersPageComponent', () => {
  let component: UsersPageComponent;
  let fixture: ComponentFixture<UsersPageComponent>;
  let screenSizeSvcSpy: ScreenSizeService = jasmine.createSpyObj('ScreenSizeService', [],
    {isMobile$: of(false)});
  let userService: jasmine.SpyObj<UserService> = jasmine.createSpyObj('UserService', ['searchUsers']);
  let authService: jasmine.SpyObj<AuthService> = jasmine.createSpyObj('AuthService', [], {user$: of(new User(userJSON))});

  const users: Array<User> = new Array<User>(10).fill(User.makeEmpty())
  const results: UsersSearchResponse = {
    totalResults: 100,
    users: users
  }

  beforeEach(() => {
    userService.searchUsers.and.returnValue(of({
        totalResults: 2,
        users: [userJSON, userJSON],
    }));
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        NgOptimizedImage,
        RouterLink,
        MatPaginatorModule,
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
      ],
      declarations: [UsersPageComponent, MockComponent(EditRoleMenuComponent)],
      providers: [
        {provide: ScreenSizeService, useValue: screenSizeSvcSpy},
        {provide: UserService, useValue: userService},
        {provide: AuthService, useValue: authService},
      ],
    });
    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should complete on destroy', () => {
    // @ts-ignore
    spyOn(component.searching$, 'complete');

    component.ngOnDestroy();

    // @ts-ignore
    expect(component.searching$.complete).toHaveBeenCalled();
  });

  beforeEach(fakeAsync(() => {
    // default search on component load
    tick(1000);
  }));

  it('should load data when page changes', fakeAsync(() => {
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 }; // Example page event

    component.onPageChange(pageEvent); // Trigger page change event

    tick(1000);

    expect(component.dataSource.length).toEqual(2);
  }));

  it('should load data when search term changes', fakeAsync(() => {
    const searchTerm = 'test'; // Example search term

    component.searchTerm = searchTerm; // Set search term
    component.onSearch(); // Trigger search event

    tick(1000);

    expect(component.dataSource.length).toEqual(2);
  }));
});
