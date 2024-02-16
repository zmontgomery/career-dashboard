import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';

import { UsersPageComponent } from './users-page.component';
import {ScreenSizeService} from "../util/screen-size.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {of} from "rxjs";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {UserSearchResults} from "./userSearchResult";
import {User} from "../security/domain/user";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

describe('UsersPageComponent', () => {
  let component: UsersPageComponent;
  let fixture: ComponentFixture<UsersPageComponent>;
  let httpMock: HttpTestingController;
  let screenSizeSvcSpy: ScreenSizeService = jasmine.createSpyObj('ScreenSizeService', [],
    {isMobile$: of(false)});

  const users: Array<User> = new Array<User>(10).fill(User.makeEmpty())
  const results: UserSearchResults = {
    totalResults: 100,
    users: users
  }

  beforeEach(() => {
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
      declarations: [UsersPageComponent],
      providers: [
        {provide: ScreenSizeService, userValue: screenSizeSvcSpy}
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function assertSearchRequest(pageOffset: number, pageSize: number, searchTerm: string,
                               resultsProvided: UserSearchResults = results,
                               expectedDataSource: Array<User> = users
                               ) {
    const url = constructBackendRequest(Endpoints.USERS_SEARCH,
      {key:'pageOffset', value:pageOffset},
      {key:'pageSize', value:pageSize},
      {key:'searchTerm', value:searchTerm})
    const request = httpMock.expectOne(url);
    expect(request.request.method).toEqual('GET');
    request.flush(resultsProvided);
    flush();
    expect(component.dataSource.length).toEqual(expectedDataSource.length);
    // should be able to do this once ids are not changed randomly
    // expect(component.dataSource).toEqual(expectedDataSource);
  }


  beforeEach(fakeAsync(() => {
    // default search on component load
    assertSearchRequest(0, 10, '')
  }));

  it('should load data when page changes', fakeAsync(() => {
    const pageEvent = { pageIndex: 1, pageSize: 10, length: 100 }; // Example page event

    component.onPageChange(pageEvent); // Trigger page change event

    assertSearchRequest(1, 10, '');
  }));

  it('should load data when search term changes', fakeAsync(() => {
    // spyOn(yourEntityService, 'searchEntities').and.returnValue(Promise.resolve([])); // Mock the service method
    const searchTerm = 'test'; // Example search term

    component.searchTerm = searchTerm; // Set search term
    component.onSearch(); // Trigger search event

    assertSearchRequest(0, 10, searchTerm);
  }));
});
