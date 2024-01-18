import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject, filter, map } from 'rxjs';
import { TempUser } from './domain/user';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
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
        console.log(this.isAuthenticated);
          if (!this.isAuthenticated) {
            const payload = result.payload as any;
            const idToken = payload["idToken"];
            console.log(idToken);
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
    if (LangUtils.exists(sessionStorage.getItem('authToken'))) {
      const tokenString = sessionStorage.getItem('authToken');
      const tokenExpiry = sessionStorage.getItem('tokenExpiry');
      const token = new Token(tokenString!, new Date(Number.parseInt(tokenExpiry!)));
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
        sessionStorage.setItem('authToken', token!.getToken());
        sessionStorage.setItem('tokenExpiry', token!.getExpiry().getTime().toString());
      } else {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('tokenExpiry');
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

  expiryCheck(url: string) {
    this.token$.subscribe((token) => {
        if (token?.willExpire()) {
          this.refresh().subscribe((res) => {
            this.processResponse(res);
            this.refreshCheckSubject.next();
          });
        } else {
        console.log(`Emitting ${url}!`);
        this.refreshCheckSubject.next();
      }
    });
  }

  signIn(loginRequest: LoginRequest): Observable<LoginResponse> {
    console.log('Signing in!');
    return this.http.post<LoginResponseJSON>(constructBackendRequest('auth/signIn'), loginRequest)
      .pipe(
        map((json) => new LoginResponse(json)),
      );
  }

  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponseJSON>(constructBackendRequest('auth/refresh'), {})
      .pipe(
        map((json) => new LoginResponse(json)),
      );
  }

  signOut() {
    this.isAuthenticated = false;
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  getToken(): Token | undefined {
    return this.token;
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
}

export class Token {
  constructor(
    private token: string,
    private tokenExpiry: Date,
  ) {}

  getToken() {
    return this.token;
  }

  getExpiry() {
    return this.tokenExpiry;
  }

  willExpire(): boolean {
    return Date.now() - this.tokenExpiry!.getMilliseconds() <= (10 * 60 * 1000)
  }
}
