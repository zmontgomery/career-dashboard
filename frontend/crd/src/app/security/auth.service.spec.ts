import { fakeAsync, tick } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, of } from 'rxjs';
import { LoginRequest, LoginResponse, Token, TokenType } from './domain/auth-objects';
import { EventType } from '@azure/msal-browser';
import { AUTH_TOKEN_STORAGE, TOKEN_ISSUED } from './security-constants';
import { LangUtils } from '../util/lang-utils';
import { UserJSON } from './domain/user';

describe('AuthService', () => {
  let service: AuthService;
  let httpSpy: HttpClient;
  let maslAuthService: MsalService;
  let broadcastService: MsalBroadcastService;
  let googleAuthService: SocialAuthService;

  const userJSON: UserJSON = {
    id: 'id',
    email: 'test@test.test',
    phoneNumber: '111-111-1111',
    dateCreated: 0,
    lastLogin: 0,
    firstName: 'test',
    lastName: 'test',
    canEmail: false,
    canTest: false
  }

  let response = new LoginResponse({token: 'id', user: userJSON});
  let request = new LoginRequest({idToken: 'token', tokenType: TokenType.GOOGLE });
  let msalSubject = new Subject<any>();
  let authStateSubject = new Subject<any>();

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    (httpSpy as any).post.and.returnValue(of(response));
    maslAuthService = jasmine.createSpyObj('MsalService', ['loginRedirect']);
    broadcastService = jasmine.createSpyObj(
        'MsalBroadcaseService', 
        ['toString'],
        {'msalSubject$': msalSubject.asObservable()}
      );
    googleAuthService = jasmine.createSpyObj(
        'SocialAuthService', 
        ['signIn'],
        {'authState': authStateSubject.asObservable()}
      );
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    spyOn(localStorage, 'getItem');
    (localStorage as any).getItem.withArgs(AUTH_TOKEN_STORAGE).and.returnValue(undefined);
    (localStorage as any).getItem.withArgs(TOKEN_ISSUED).and.returnValue(undefined);

    service = new AuthService(httpSpy, maslAuthService, broadcastService, googleAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Token initialization', () => {
    const token = new Token('token', new Date(Date.now()));
    let count = 0;

    function untilAllDone(c: number, done: DoneFn) {
      count++;
      if (count >= c) {
        count = 0;
        done();
      }
    }

    let sub1: Subscription;
    let sub2: Subscription;

    function assertFailure(done: DoneFn) {
      expect(service.getToken()).toBeUndefined();
      expect(service.authenticated()).toBeFalse();

      sub1 = service.token$.subscribe((t) => {
        expect(t).toBeNull();
        untilAllDone(2, done);
      });

      sub2 = service.user$.subscribe((u) => {
        expect(u).toBeNull();
        untilAllDone(2, done);
      });
    }

    afterEach(() => {
      if (LangUtils.exists(sub1 && sub2)) {
        sub1.unsubscribe();
        sub2.unsubscribe();
      }
    });

    it('should retrieve token from local storage', fakeAsync(() => {
      (localStorage as any).getItem.withArgs(AUTH_TOKEN_STORAGE).and.returnValue(token.getToken());
      (localStorage as any).getItem.withArgs(TOKEN_ISSUED).and.returnValue(token.getExpiry().getTime());

      service = new AuthService(httpSpy, maslAuthService, broadcastService, googleAuthService);

      sub1 = service.token$.subscribe((t) => {
        expect(t?.getToken()).toEqual(token.getToken());
        expect(t?.getExpiry()).toEqual(token.getExpiry());
      });

      sub2 = service.user$.subscribe((u) => {
        expect(u).toBeNull();
      });

      tick(1000);

      expect(service.getToken()?.getToken()).toEqual(token.getToken());
      expect(service.getToken()?.getExpiry()).toEqual(token.getExpiry());
      expect(service.authenticated()).toBeTrue();
    }));

    it('should fail when token from local storage is null', (done) => {
      (localStorage as any).getItem.withArgs(AUTH_TOKEN_STORAGE).and.returnValue(undefined);
      (localStorage as any).getItem.withArgs(TOKEN_ISSUED).and.returnValue(token.getExpiry().getTime());

      service = new AuthService(httpSpy, maslAuthService, broadcastService, googleAuthService);

      assertFailure(done);
    });

    it('should fail when token issue date from local storage is null', (done) => {
      (localStorage as any).getItem.withArgs(AUTH_TOKEN_STORAGE).and.returnValue(token.getToken());
      (localStorage as any).getItem.withArgs(TOKEN_ISSUED).and.returnValue(undefined);

      service = new AuthService(httpSpy, maslAuthService, broadcastService, googleAuthService);

      assertFailure(done);
    });

    it('should fail when there is nothing in local storage', (done) => {
      (localStorage as any).getItem.withArgs(AUTH_TOKEN_STORAGE).and.returnValue(undefined);
      (localStorage as any).getItem.withArgs(TOKEN_ISSUED).and.returnValue(undefined);

      service = new AuthService(httpSpy, maslAuthService, broadcastService, googleAuthService);

      assertFailure(done);
    });

    it('should fail when token is expired', (done) => {
      (localStorage as any).getItem.withArgs(AUTH_TOKEN_STORAGE).and.returnValue('token');
      (localStorage as any).getItem.withArgs(TOKEN_ISSUED).and.returnValue(0);

      service = new AuthService(httpSpy, maslAuthService, broadcastService, googleAuthService);

      assertFailure(done);
    });

    it('should set token from local storage if it exists', fakeAsync(() => {
      // @ts-ignore
      service.tokenSubject.next(token);

      tick(1000);

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    }));

    it ('should have removed token from local storage if the token did not exist', fakeAsync(() => {
      tick(1000);

      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
    }));
  });

  describe('Login redirect', () => {
    it('should login redirect for MS', () => {
      service.loginRedirectMS();
  
      expect(maslAuthService.loginRedirect).toHaveBeenCalledTimes(1);
    });
  
    it('should login redirect for Google', () => {
        service.loginRedirectGoogle();
  
        expect(googleAuthService.signIn).toHaveBeenCalledOnceWith(GoogleLoginProvider.PROVIDER_ID);
    });
  });

  describe('HTTP calls', () => {
    it('should signIn', (done) => {
      service.signIn(request).subscribe((res) => {
        expect((httpSpy as HttpClient).post).toHaveBeenCalled();
        expect(res).toEqual(response);
        done();
      });
    });

    it('should refresh', (done) => {
      service.refresh().subscribe((res) => {
        expect((httpSpy as HttpClient).post).toHaveBeenCalled();
        expect(res).toEqual(response);
        done();
      });
    });
  });

  describe('OAuth', () => {
    const t = new Token('token', new Date(1000));

    function reloadService(token: Token | undefined) {
      (localStorage as any).getItem.withArgs(AUTH_TOKEN_STORAGE).and.returnValue(token?.getToken());
      (localStorage as any).getItem.withArgs(TOKEN_ISSUED).and.returnValue(token?.getExpiry().getTime());

      service = new AuthService(httpSpy, maslAuthService, broadcastService, googleAuthService);
    }

    describe('Google', () => {
      it ('should sign in to google if not authenticated', fakeAsync(() => {
        tick(100);

        // @ts-ignore
        service.isAuthenticated = false;
        authStateSubject.next({idToken: 'token'});
        tick(100);
        expect(httpSpy.post).toHaveBeenCalled();
      }));
    
      it ('should not sign in to google if authenticated',fakeAsync(() => {
        tick(1000);

        // @ts-ignore
        service.isAuthenticated = true;
        authStateSubject.next({idToken: 'token'});
        tick(100);
        expect(httpSpy.post).not.toHaveBeenCalled();
      }));
    });

    describe('Microsoft', () => {
      it ('should sign in to ms if not authenticated', fakeAsync(() => {
        tick(100);

        // @ts-ignore
        service.isAuthenticated = false;
        msalSubject.next({
          eventType: EventType.LOGIN_SUCCESS,
          payload: {idToken: 'token'}
        });
        tick(100);
        expect(httpSpy.post).toHaveBeenCalled();
      }));
    
      it ('should not sign in to ms if authenticated',fakeAsync(() => {
        tick(100);

        // @ts-ignore
        service.isAuthenticated = true;
        msalSubject.next({
          eventType: EventType.LOGIN_SUCCESS,
          payload: {idToken: 'token'}
        });
        tick(100);
        expect(httpSpy.post).not.toHaveBeenCalled();
      }));
    
      it ('should not sign not to ms if event type is not LOGIN_SUCCESS',fakeAsync(() => {
        tick(100);

        // @ts-ignore
        service.isAuthenticated = false;
        msalSubject.next({
          eventType: EventType.ACCOUNT_ADDED,
          payload: {idToken: 'token'}
        });
        tick(100);
        expect(httpSpy.post).not.toHaveBeenCalled();
      }));
    });
  });

  describe('Expiry check', () => {
    const token = new Token('token', new Date(1000));

    beforeEach(() => {
      service.token$ = of(token);

      // @ts-ignore
      service.token = token;
    });

    it('should pass through the token observable if it does not need refreshed', (done) => {
      spyOn(service, 'refresh');
      spyOn(token, 'willExpire').and.returnValue(false);
      spyOn(token, 'isRefreshing').and.returnValue(false);

      service.expiryCheck().subscribe((t) => {
        expect(t?.getToken()).toEqual(token.getToken());
        expect(service.refresh).not.toHaveBeenCalled();

        done();
      });
    });

    it('should pass through the token observable if it is currently refreshing', (done) => {
      spyOn(service, 'refresh');
      spyOn(token, 'willExpire').and.returnValue(false);
      spyOn(token, 'isRefreshing').and.returnValue(true);

      service.expiryCheck().subscribe((t) => {
        expect(t?.getToken()).toEqual(token.getToken());
        expect(service.refresh).not.toHaveBeenCalled();

        done();
      });
    });

    it('should pass through the token observable and call refresh', (done) => {
      spyOn(service, 'refresh').and.returnValue(of(response));
      spyOn(token, 'willExpire').and.returnValue(true);
      spyOn(token, 'isRefreshing').and.returnValue(false);

      service.expiryCheck().subscribe((t) => {
        expect(t?.getToken()).toEqual('id');
        expect(service.refresh).toHaveBeenCalled();

        done();
      });
    });
  });

  it('should sign out', fakeAsync(() => {
    // @ts-ignore
    service.isAuthenticated = true;

    //@ts-ignore
    service.token = 'hello';
    
    service.signOut();
    tick(1000);

    //@ts-ignore
    expect(service.user).toBeFalsy();
    expect(service.authenticated()).toBeFalse();
    expect(service.getToken()).toBeFalsy();
  }));

  it('should clear expire token', () => {
    // @ts-ignore
    service.isAuthenticated = true;
        
    service.expireToken();

    //@ts-ignore
    expect(service.user).toBeFalsy();
    expect(service.authenticated()).toBeFalse();
  });
});
