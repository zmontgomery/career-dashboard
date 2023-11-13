import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, filter, map, tap } from 'rxjs';
import { TempUser } from './user';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { EventMessage, EventType } from '@azure/msal-browser';
import { LoginRequest, LoginResponse, LoginResponseJSON, TokenType } from './login-objects';
import { constructBackendRequest } from '../util/http-helper';

export const SESSION_KEY = 'session';

/**
 * Service used for authentication and checking if the user is authenticated
 * 
 * @author Jimmy Logan <jrl9984@rit.edu>
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean;
  
  private user?: TempUser;

  constructor(
    private readonly http: HttpClient,
    private readonly msalAuthServer: MsalService,
    private readonly broadcastService: MsalBroadcastService,
    private readonly googleAuthService: SocialAuthService,
  ) { 
    this.isAuthenticated = false;

    this.broadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
    )
    .subscribe((result: EventMessage) => {
      if (!this.isAuthenticated) {
        const payload = result.payload as any;
        const idToken = payload["idToken"];
        const tokenType = TokenType.MICROSOFT_ENTRA_ID;
        console.log(tokenType.toString());
        const loginRequest = new LoginRequest({
          idToken: idToken,
          tokenType: tokenType.toLocaleString(),
        })

        this.signIn(loginRequest).subscribe((res) => {
          this.processResponse(res);
        });
      }
    });

    this.googleAuthService.authState.subscribe((state) => console.log(state));
  }

  loginRedirectMS() {
    this.msalAuthServer.loginRedirect();
  }

  loginRedirectGoogle() {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signIn(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponseJSON>(constructBackendRequest('auth/signIn'), loginRequest)
      .pipe(
        map((json) => new LoginResponse(json)),
      );
  }

  signOut() {

  }

  private processResponse(res: LoginResponse) {
    if (res !== null || res !== undefined) {
      this.user = res.user;
      sessionStorage.setItem(SESSION_KEY, res.sessionID);
      console.log(sessionStorage.getItem(SESSION_KEY));
    }
  }
}
