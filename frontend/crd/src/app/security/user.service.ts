import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role, User, UserJSON } from './domain/user';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import { Observable, map, of } from 'rxjs';
import { UsersSearchResponseJSON } from '../users-page/user-search-result';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  updateRole(user: User): Observable<User> {
    return this.http.put<UserJSON>(constructBackendRequest(Endpoints.UPDATE_ROLES), user)
      .pipe(map((u) => new User(u)));
  }

  searchUsers(offset: number, size: number, term: string): Observable<UsersSearchResponseJSON> {
    const apiUrl = constructBackendRequest(Endpoints.USERS_SEARCH,
        {key:'pageOffset', value: offset},
        {key:'pageSize', value: size},
        {key: 'searchTerm', value: term}
    );

    return this.http.get<UsersSearchResponseJSON>(apiUrl);
  }

  getUser(id: string): Observable<User | null> {
    return this.http.get<UserJSON>(`${constructBackendRequest(Endpoints.USERS)}/${id}`)
      .pipe(map((u) => new User(u)));
  }
}
