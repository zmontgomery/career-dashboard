import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserJSON } from './domain/user';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import {Observable, map, switchMap, of, Subject, ReplaySubject} from 'rxjs';
import { UsersSearchResponseJSON } from '../users-page/user-search-result';
import {AuthService} from "./auth.service";
import {LangUtils} from "../util/lang-utils";
import {ArtifactService} from "../file-upload/artifact.service";

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

  searchUsers(offset: number, size: number, term: string): Observable<UsersSearchResponseJSON> {
    const apiUrl = constructBackendRequest(Endpoints.USERS_SEARCH,
        {key:'pageOffset', value: offset},
        {key:'pageSize', value: size},
        {key: 'searchTerm', value: term}
    );

    return this.http.get<UsersSearchResponseJSON>(apiUrl);
  }

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
          console.log('null user')
          this.userProfileURL$?.next(null)
        }
      });
    }

    return this.userProfileURL$.asObservable();
  }

  private getProfilePictureRequest(): Observable<string | null> {
    return this.http.get(constructBackendRequest(Endpoints.USERS_PROFILE_PICTURE), { responseType: 'blob' })
      .pipe(map((data: any) => {
        if (data != null) {
          return URL.createObjectURL(new Blob([data]));
        } else return null;
      }));
  }
}
