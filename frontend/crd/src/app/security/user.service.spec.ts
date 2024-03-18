import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { userJSON } from './auth.service.spec';
import { User } from './domain/user';
import { HttpClientModule } from '@angular/common/http';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import { UsersSearchResponseJSON } from '../users-page/user-search-result';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update role', (done) => {
    const user = new User(userJSON);
    service.updateRole(user).subscribe((result: User) => {
      expect(result).toEqual(user);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.UPDATE_ROLES));
    expect(request.request.method).toEqual('PUT');
    request.flush(userJSON);
  });

  it('should search', (done) => {
    const users = [new User(userJSON), new User(userJSON)];
    service.searchUsers(10, 11, '').subscribe((results: UsersSearchResponseJSON) => {
      expect(results.totalResults).toEqual(2);
      expect(new User(results.users[0])).toEqual(users[0]);
      expect(new User(results.users[1])).toEqual(users[1]);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.USERS_SEARCH, 
      {key:'pageOffset', value: 10},
      {key:'pageSize', value: 11},
      {key: 'searchTerm', value: ''}
    ));
    expect(request.request.method).toEqual('GET');
    request.flush({
      totalResults: 2,
      users: [userJSON, userJSON]
    });
  });

  it('should get a user', (done) => {
    const user = new User(userJSON);
    service.getUser('id').subscribe((res: User | null) => {
      expect(res).toEqual(user);
      done();
    });

    const req = httpMock.expectOne(constructBackendRequest(Endpoints.USERS) + '/id');
    expect(req.request.method).toEqual('GET');
    req.flush(userJSON);
  })
});
