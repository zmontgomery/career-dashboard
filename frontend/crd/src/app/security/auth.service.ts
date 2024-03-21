import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, map, mergeMap, of, take } from 'rxjs';
import { User, UserJSON } from './domain/user';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { EventMessage, EventType } from '@azure/msal-browser';
import { LoginRequest, LoginResponse, LoginResponseJSON, Token, TokenType } from './domain/auth-objects';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import { LangUtils } from '../util/lang-utils';
import { AUTH_TOKEN_STORAGE, TOKEN_ISSUED } from './security-constants';
import { ActivatedRoute} from '@angular/router';

export const SESSION_KEY = 'session';

export const LOCATION = new InjectionToken<Location>(
  'Location',
  {
      providedIn: 'root',
      factory(): Location {
          return location;
      }
  }
);

/**
 * Service used for authentication and checking if the user is authenticated
 *
 * @author Jimmy Logan <jrl9984@rit.edu>
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubect: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubect.asObservable();

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
      private readonly activatedRoute: ActivatedRoute,
      @Inject(LOCATION) private readonly location: Location,
    ) {
    this.isAuthenticatedSubect.next(false);
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
    this.isAuthenticated$.subscribe((auth) => {
      if (!auth) {
        this.location.href = '/login';
      }
    })

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
   * Loads the current user from the backend
   */
  loadUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token$.pipe(take(1)).subscribe((token) => {
        if (LangUtils.exists(token)) {
          this.http.get<UserJSON>(constructBackendRequest(Endpoints.CURRENT_USER))
            .pipe(
              map((u) => new User(u)),
              catchError(() => of(null))
            )
            .subscribe((user) => {
              if (LangUtils.exists(user)) {
                this.userSubject.next(user);
                resolve(null);
              } else {
                this.location.href = '/login';
                this.clearAuthData();
                reject();
              }
            });
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Takes a non signed in user and updates it
   */
  signup(user: User) {
    return this.http.post<UserJSON>(constructBackendRequest(Endpoints.SIGN_UP), user)
      .pipe(
        map((userData) => new User(userData)),
      )
      .subscribe((newUser) => {
        this.userSubject.next(newUser);
        this.location.href = '/';
      });
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
        this.isAuthenticated$.pipe(take(1)).subscribe((isAuthenticated) => {
          if (!isAuthenticated) {
            const payload = result.payload as any;
            const idToken = payload["idToken"];
            this.signIn(this.createLoginRequest(idToken, TokenType.MICROSOFT_ENTRA_ID)).subscribe((res) => {
              this.processResponse(res);
              this.navigateOffLogin();
            });
          }
        });
    });
  }

  /**
   * Subsribes to the google auth state, creates a log in request, and signs in the user
   */
  private listenForGoogleSignIn() {
    this.googleAuthService.authState.subscribe((state) => {
      if (LangUtils.exists(state)) {
        this.isAuthenticated$.pipe(take(1)).subscribe((isAuthenticated) => {
          if (!isAuthenticated) {
            this.signIn(this.createLoginRequest(state.idToken, TokenType.GOOGLE)).subscribe((res) => {
              this.processResponse(res);
              this.navigateOffLogin();
            });
          }
        });
      }
    });
  }

  /**
   * Subscribes to the token observable to update local storage
   */
  private listenForTokenUpdates() {
    this.token$.subscribe((token) => {
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
        this.isAuthenticatedSubect.next(false);
        this.tokenSubject.next(null);
        this.userSubject.next(null);
        return;
      }

      this.token = token;
      this.isAuthenticatedSubect.next(true);
      this.tokenSubject.next(token);
    } else {
      this.isAuthenticatedSubect.next(false);
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
      this.isAuthenticatedSubect.next(true);

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
    this.isAuthenticatedSubect.next(false);
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  private navigateOffLogin() {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((p) => {
      if ('attempted' in p) {
        this.location.href = p['attempted'];
      } else {
        this.location.href = '';
      }
    });
  }
}
