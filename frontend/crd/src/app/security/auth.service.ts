import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, filter, map, mergeMap, of, tap } from 'rxjs';
import { User } from './domain/user';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { EventMessage, EventType } from '@azure/msal-browser';
import { LoginRequest, LoginResponse, LoginResponseJSON, Token, TokenType } from './domain/auth-objects';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import { LangUtils } from '../util/lang-utils';
import { AUTH_TOKEN_STORAGE, TOKEN_ISSUED } from './security-constants';

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
  private isAuthenticated: boolean;

  private tokenSubject: BehaviorSubject<Token | null> = new BehaviorSubject<Token | null>(null);
  token$ = this.tokenSubject.asObservable();

  private token?: Token;

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly msalAuthService: MsalService,
    private readonly broadcastService: MsalBroadcastService,
    private readonly googleAuthService: SocialAuthService,
  ) { 
    this.isAuthenticated = false;
    this.listenForMSALSignIn();
    this.listenForGoogleSignIn();
    this.loadToken();
    this.listenForTokenUpdates();
  }

  /**
   * Redirects to the microsoft login page
   */
  loginRedirectMS() {
    this.msalAuthService.loginRedirect();
  }

  /**
   * Redirects to the google login page
   */
  loginRedirectGoogle() {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  /**
   * Determines if the token needs to be refreshed, and if so,
   * calles the refresh endpoint
   * 
   * @returns the token observable
   */
  expiryCheck(): Observable<Token | null> {
    if (this.token!.isRefreshing()) {
      // returns the observable directly if refreshing to prevent
      // duplicate refresh requests

      return this.token$;
    } else if (this.token?.willExpire()) {
      // Calls the refresh endpoint if the token is expiring soon
      // It then returns an observable of the new token

      this.token?.refresh();
      return this.refresh().pipe(
        mergeMap((res) => {
          this.processResponse(res);
          return of(this.token!);
        })
      );
    } else {
      // Return the observable token by default

      return this.token$;
    }
  }

  /**
   * Signs in the user
   * 
   * @param loginRequest - login request to the backend
   * @returns a login response
   */
  signIn(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponseJSON>(constructBackendRequest(Endpoints.SIGN_IN), loginRequest)
      .pipe(
        map((json) => new LoginResponse(json)),
      );
  }

  /**
   * Refreshes a token
   * 
   * @returns a login response
   */
  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponseJSON>(constructBackendRequest(Endpoints.REFRESH), {})
      .pipe(
        map((json) => new LoginResponse(json)),
      );
  }

  /**
   * Signs out the user
   */
  signOut() {
    this.http.post<string>(constructBackendRequest(Endpoints.SIGN_OUT), {}).subscribe(() => {
      this.clearAuthData();
    });
  }

  /**
   * @returns the token
   */
  getToken(): Token | undefined {
    return this.token;
  }

  /**
   * Expires the current token
   */
  expireToken(): void {
    this.clearAuthData();
  }

  /**
   * @returns if the user is authenticated
   */
  authenticated(): boolean {
    return this.isAuthenticated;
  }

  //
  // Private
  //

  /**
   * Subscribes to the broadcast from microsoft, creates a log in request, and signs in the user
   */
  private listenForMSALSignIn() {
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
  }

  /**
   * Subsribes to the google auth state, creates a log in request, and signs in the user
   */
  private listenForGoogleSignIn() {
    this.googleAuthService.authState.subscribe((state) => {
      console.log(state);
      if (LangUtils.exists(state)) {
          if (!this.isAuthenticated) {
            this.signIn(this.createLoginRequest(state.idToken, TokenType.GOOGLE)).subscribe((res) => {
              this.processResponse(res);
            });
          }
      }
    });
  }

  /**
   * Subscribes to the token observable to update local storage
   */
  private listenForTokenUpdates() {
    this.token$.subscribe((token) => {
      console.log(token);
      if (LangUtils.exists(token)) {
        localStorage.setItem(AUTH_TOKEN_STORAGE, token!.getToken());
        localStorage.setItem(TOKEN_ISSUED, token!.getExpiry().getTime().toString());
        this.token = token!;
      } else {
        localStorage.removeItem(AUTH_TOKEN_STORAGE);
        localStorage.removeItem(TOKEN_ISSUED);
        this.token = undefined;
      }
    });
  }

  /**
   * Loads the token on service creation
   */
  private loadToken() {
    // Load token from session storage
    const tokenString = localStorage.getItem(AUTH_TOKEN_STORAGE);
    const tokenIssued = Number.parseInt(localStorage.getItem(TOKEN_ISSUED)!);

    if (LangUtils.exists(tokenString) && LangUtils.isANumber(tokenIssued)) {
      const token = new Token(tokenString!, new Date(tokenIssued!));
      if (token.expired()) {
        this.isAuthenticated = false;
        this.tokenSubject.next(null);
        this.userSubject.next(null);
        return;
      }

      this.token = token;
      this.isAuthenticated = true;
      this.tokenSubject.next(token);
      this.userSubject.next(null);
    } else {
      this.isAuthenticated = false;
      this.tokenSubject.next(null);
      this.userSubject.next(null);
    }
  }

  /**
   * Processes a login response 
   * 
   * @param res - the login response
   */
  private processResponse(res: LoginResponse) {
    if (LangUtils.exists(res)) {
      this.isAuthenticated = true;

      const token = new Token(res.token, new Date(Date.now()));
      this.tokenSubject.next(token);

      this.userSubject.next(res.user);
    }
  }

  /**
   * Creates a login request
   * 
   * @param token - id token
   * @param tokenType - token source
   * @returns 
   */
  private createLoginRequest(token: string, tokenType: TokenType): LoginRequest {
    return new LoginRequest({
      idToken: token,
      tokenType: tokenType.toLocaleString(),
    });
  }

  /**
   * Clears all data related to authentication
   */
  private clearAuthData() {
    this.isAuthenticated = false;
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }
}
