import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserJSON } from './domain/user';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import {Observable, map, ReplaySubject, of} from 'rxjs';
import { UsersSearchResponseJSON } from '../users-page/user-search-result';
import {AuthService} from "./auth.service";
import {LangUtils} from "../util/lang-utils";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userProfileURL$: ReplaySubject<string | null> | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    ) {
  }

  updateRole(user: User): Observable<User> {
    return this.http.put<UserJSON>(constructBackendRequest(Endpoints.UPDATE_ROLES), user)
      .pipe(map((u) => new User(u)));
  }

  getStudent(studentID: string): Observable<User> {
    return this.http.get<UserJSON>(constructBackendRequest(Endpoints.STUDENT_INFO, {key: 'studentID', value: studentID}))
      .pipe(map((u) => new User(u)));
  }

  /**
   * Search for users. Gets a paged result of the users which includes a list of users and the total number of users
   * available with the given search term
   * @param offset page off set to grab
   * @param size size of the list of users to retrieve
   * @param term Search term. Currently only supports first/last name
   */
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

  /**
   * Get the Users profile picture as url. Caches the result for reuse.
   * @param forceRefresh force a request to the Backend to retrieve the image and update the cached image
   */
  getProfilePicture(forceRefresh: boolean = false): Observable<string | null> {
    if (this.userProfileURL$ == null || forceRefresh) {
      if (this.userProfileURL$ == null) {
        this.userProfileURL$ = new ReplaySubject(1);
      }
      this.authService.user$.subscribe((user) => {
        if (LangUtils.exists(user)) {
          this.getProfilePictureRequest()
            .subscribe((url) => this.userProfileURL$?.next(url));
        }
        else {
          this.userProfileURL$?.next(null)
        }
      });
    }

    return this.userProfileURL$.asObservable();
  }

  /**
   * handle the http request part of getting the profile picture
   * @private
   */
  private getProfilePictureRequest(): Observable<string | null> {
    return this.http.get(constructBackendRequest(Endpoints.USERS_PROFILE_PICTURE), { responseType: 'blob' })
      .pipe(map((data: any) => {
        if (data != null) {
          return URL.createObjectURL(new Blob([data]));
        } else return null;
      }));
  }
}
