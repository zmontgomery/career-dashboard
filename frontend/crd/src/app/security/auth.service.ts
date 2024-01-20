import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, filter, map, mergeMap, of, tap } from 'rxjs';
import { TempUser } from './domain/user';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { EventMessage, EventType } from '@azure/msal-browser';
import { LoginRequest, LoginResponse, LoginResponseJSON, TokenType } from './domain/login-objects';
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

  private userSubject: BehaviorSubject<TempUser | null> = new BehaviorSubject<TempUser | null>(null);
  user$ = this.userSubject.asObservable();

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
      if (LangUtils.exists(state)) {
          if (!this.isAuthenticated) {
            this.signIn(this.createLoginRequest(state.idToken, TokenType.GOOGLE)).subscribe((res) => {
              this.processResponse(res);
            });
          }
      }
    });

    // Load token from session storage
    const tokenString = localStorage.getItem(AUTH_TOKEN_STORAGE);
    const tokenIssued = Number.parseInt(localStorage.getItem(TOKEN_ISSUED)!);

    if (LangUtils.exists(tokenString) && LangUtils.isANumber(tokenIssued)) {
      const token = new Token(tokenString!, new Date(tokenIssued!));
      this.token = token;

      this.isAuthenticated = true;
      this.tokenSubject.next(token);
      this.userSubject.next(null);
    } else {
      this.isAuthenticated = false;
      this.tokenSubject.next(null);
      this.userSubject.next(null);
    }

    this.token$.subscribe((token) => {
      if (LangUtils.exists(token)) {
        localStorage.setItem(AUTH_TOKEN_STORAGE, token!.getToken());
        localStorage.setItem(TOKEN_ISSUED, token!.getExpiry().getTime().toString());
        this.token = token!;
      } else {
        localStorage.removeItem(AUTH_TOKEN_STORAGE);
        localStorage.removeItem(TOKEN_ISSUED);
      }
    });
  }

  loginRedirectMS() {
    this.msalAuthService.loginRedirect();
  }

  loginRedirectGoogle() {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  private refreshCheckSubject = new Subject<void>();
  refreshCheck$ = this.refreshCheckSubject.asObservable();

  expiryCheck(): Observable<Token | null> {
    if (this.token!.isRefreshing()) {
      return this.token$;
    } else if (this.token?.willExpire()) {
      this.token?.refresh();
      return this.refresh().pipe(
        mergeMap((res) => {
          this.processResponse(res);
          return of(this.token!);
        })
      );
    } else {
      return this.token$;
    }
  }

  signIn(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponseJSON>(constructBackendRequest(Endpoints.SIGN_IN), loginRequest)
      .pipe(
        map((json) => new LoginResponse(json)),
      );
  }

  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponseJSON>(constructBackendRequest(Endpoints.REFRESH), {})
      .pipe(
        map((json) => new LoginResponse(json)),
      );
  }

  signOut() {
    this.clearAuthData();
  }

  getToken(): Token | undefined {
    return this.token;
  }

  expireToken(): void {
    this.clearAuthData();
  }

  private processResponse(res: LoginResponse) {
    if (LangUtils.exists(res)) {
      this.isAuthenticated = true;

      const token = new Token(res.token, new Date(Date.now()));
      this.tokenSubject.next(token);

      this.userSubject.next(res.user);
    }
  }

  private createLoginRequest(token: string, tokenType: TokenType): LoginRequest {
    return new LoginRequest({
      idToken: token,
      tokenType: tokenType.toLocaleString(),
    });
  }

  private clearAuthData() {
    this.isAuthenticated = false;
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }
}

export class Token {
  private refreshing: boolean;

  constructor(
    private token: string,
    private tokenIssued: Date,
  ) {
    this.refreshing = false;
  }

  getToken() {
    return this.token;
  }

  getExpiry() {
    return this.tokenIssued;
  }

  willExpire(): boolean {
    return Date.now() >= this.tokenIssued!.getTime() + (20 * 60 * 1000);
  }

  expired(): boolean {
    return Date.now() >= this.tokenIssued!.getTime() + (60 * 60 * 1000);
  }

  refresh() {
    this.refreshing = true;
  }

  isRefreshing(): boolean {
    return this.refreshing;
  }
}
