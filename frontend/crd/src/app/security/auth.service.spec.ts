import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { LoginRequest, LoginResponse, TokenType } from './domain/login-objects';
import { EventType } from '@azure/msal-browser';

fdescribe('AuthService', () => {
  let service: AuthService;
  let httpSpy: HttpClient;
  let maslAuthService: MsalService;
  let broadcastService;
  let googleAuthService: SocialAuthService;

  let response = new LoginResponse({sessionID: 'id', user: {email: 'a@a.a', name: 'test', oid: 'a', role: 'a'}});
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

    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: httpSpy},
        {provide: MsalService, useValue: maslAuthService},
        {provide: MsalBroadcastService, useValue: broadcastService},
        {provide: SocialAuthService, useValue: googleAuthService},
        AuthService,
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login redirect for MS', () => {
    service.loginRedirectMS();

    expect(maslAuthService.loginRedirect).toHaveBeenCalledTimes(1);
  });

  it('should login redirect for Google', () => {
      service.loginRedirectGoogle();

      expect(googleAuthService.signIn).toHaveBeenCalledOnceWith(GoogleLoginProvider.PROVIDER_ID);
  });

  it('should signIn', (done) => {
    service.signIn(new LoginRequest({idToken: 'token', tokenType: TokenType.GOOGLE })).subscribe((res) => {
      expect((httpSpy as HttpClient).post).toHaveBeenCalled();
      expect(res).toEqual(response);
      done();
    });
  });

  it ('should sign in to google if not authenticated', fakeAsync(() => {
    service.isAuthenticated = false;
    authStateSubject.next({idToken: 'token'});
    tick(100);
    expect(httpSpy.post).toHaveBeenCalled();
  }));

  it ('should not sign in to google if authenticated',fakeAsync(() => {
    service.isAuthenticated = true;
    authStateSubject.next({idToken: 'token'});
    tick(100);
    expect(httpSpy.post).not.toHaveBeenCalled();
  }));

  it ('should sign in to ms if not authenticated', fakeAsync(() => {
    service.isAuthenticated = false;
    msalSubject.next({
      eventType: EventType.LOGIN_SUCCESS,
      payload: {idToken: 'token'}
    });
    tick(100);
    expect(httpSpy.post).toHaveBeenCalled();
  }));

  it ('should not sign in to ms if authenticated',fakeAsync(() => {
    service.isAuthenticated = true;
    msalSubject.next({
      eventType: EventType.LOGIN_SUCCESS,
      payload: {idToken: 'token'}
    });
    tick(100);
    expect(httpSpy.post).not.toHaveBeenCalled();
  }));

  it ('should not sign not to ms if event type is not LOGIN_SUCCESS',fakeAsync(() => {
    service.isAuthenticated = false;
    msalSubject.next({
      eventType: EventType.ACCOUNT_ADDED,
      payload: {idToken: 'token'}
    });
    tick(100);
    expect(httpSpy.post).not.toHaveBeenCalled();
  }));

  it('should sign out', () => {
    service.isAuthenticated = true;
    
    service.signOut();

    //@ts-ignore
    expect(service.user).toBeFalsy();
    expect(service.isAuthenticated).toBeFalse();
  });
});
