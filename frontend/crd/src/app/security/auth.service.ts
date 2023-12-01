import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, filter, map, tap } from 'rxjs';
import { TempUser } from './domain/user';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { EventMessage, EventType } from '@azure/msal-browser';
import { LoginRequest, LoginResponse, LoginResponseJSON, TokenType } from './domain/login-objects';
import { constructBackendRequest } from '../util/http-helper';
import { LangUtils } from '../util/lang-utils';

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
    private readonly msalAuthService: MsalService,
    private readonly broadcastService: MsalBroadcastService,
    private readonly googleAuthService: SocialAuthService,
  ) { 
    this.isAuthenticated = false;

    this.broadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS))
      .subscribe((result: EventMessage) => {
        if (!this.isAuthenticated) {
          const payload = result.payload as any;
          const idToken = payload["idToken"];
          this.signIn(this.createLoginRequest(idToken, TokenType.MICROSOFT_ENTRA_ID)).subscribe((res) => {
            this.processResponse(res);
          });
        }
    });

    this.googleAuthService.authState.subscribe((state) => {
      if (!this.isAuthenticated) {
        this.signIn(this.createLoginRequest(state.idToken, TokenType.GOOGLE)).subscribe((res) => {
          this.processResponse(res);
        });
      }
    });
  }

  loginRedirectMS() {
    this.msalAuthService.loginRedirect();
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
    this.user = undefined;
    this.isAuthenticated = false;
  }

  private processResponse(res: LoginResponse) {
    if (LangUtils.exists(res)) {
      this.user = res.user;
      this.isAuthenticated = true;
      sessionStorage.setItem(SESSION_KEY, res.sessionID);
    }
  }

  private createLoginRequest(token: string, tokenType: TokenType): LoginRequest {
    return new LoginRequest({
      idToken: token,
      tokenType: tokenType.toLocaleString(),
    });
  }
}
