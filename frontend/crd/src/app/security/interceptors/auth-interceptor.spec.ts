import { AuthInterceptor } from "./auth-interceptor";
import { HttpEvent, HttpEventType, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { AuthService } from "../auth.service";
import { Endpoints } from "src/app/util/http-helper";
import { Token } from "../domain/auth-objects";
import { fakeAsync, tick } from "@angular/core/testing";

class DummyHandler extends HttpHandler {
    override handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return of({type: HttpEventType.Sent, request: req});
    }
}

class DummyErrorHandler extends HttpHandler {
    constructor (private readonly code: number) {
        super();
    }

    override handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return throwError(() => {return {status: this.code}});
    }
}

describe('AuthInterceptor', () => {
    let authServiceSpy: AuthService;
    let CuT: AuthInterceptor;

    const token = new Token('token', new Date(1000));
    const token2 = new Token('token2', new Date(1001));
  
    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'expiryCheck', 'expireToken']);
        (authServiceSpy as any).expiryCheck.and.returnValue(of(token2));
        CuT = new AuthInterceptor(authServiceSpy);
    });
  
    it('should be created', () => {
      expect(CuT).toBeTruthy();
    });

    it ('should allow sign in to pass through unscathed', (done) => {
        const request = new HttpRequest('GET', Endpoints.SIGN_IN);

        CuT.intercept(request, new DummyHandler()).subscribe((res) => {
            const req = (res as any)['request'] as HttpRequest<any>;
            expect(authServiceSpy.expireToken).not.toHaveBeenCalled();
            expect(req.url).toEqual(request.url);
            expect(req.headers.has('X-Authorization')).toBeFalse();
            done();
        });
    });

    it ('proceed as normal if token is null', (done) => {
        const request = new HttpRequest('GET', Endpoints.DASHBOARD_EVENTS);

        CuT.intercept(request, new DummyHandler()).subscribe((res) => {
            const req = (res as any)['request'] as HttpRequest<any>;
            expect(authServiceSpy.expireToken).not.toHaveBeenCalled();
            expect(req.url).toEqual(request.url);
            expect(req.headers.has('X-Authorization')).toBeFalse();
            done();
        });
    });

    it ('update request if token exists', (done) => {
        (authServiceSpy as any).getToken.and.returnValue(token);
        const request = new HttpRequest('GET', Endpoints.DASHBOARD_EVENTS);

        CuT.intercept(request, new DummyHandler()).subscribe((res) => {
            const req = (res as any)['request'] as HttpRequest<any>;
            expect(req.url).toEqual(request.url);
            expect(authServiceSpy.expireToken).not.toHaveBeenCalled();
            expect(authServiceSpy.expiryCheck).toHaveBeenCalled();
            expect(req.headers.has('X-Authorization')).toBeTrue();
            expect(req.headers.get('X-Authorization')).toEqual(`Bearer ${token2.getToken()}`);
            done();
        });
    });

    it ('update request if token exists, but not call refresh if endpoint is refresh', (done) => {
        (authServiceSpy as any).getToken.and.returnValue(token);
        const request = new HttpRequest('GET', Endpoints.REFRESH);

        CuT.intercept(request, new DummyHandler()).subscribe((res) => {
            const req = (res as any)['request'] as HttpRequest<any>;
            expect(req.url).toEqual(request.url);
            expect(authServiceSpy.expireToken).not.toHaveBeenCalled();
            expect(authServiceSpy.expiryCheck).not.toHaveBeenCalled();
            expect(req.headers.has('X-Authorization')).toBeTrue();
            expect(req.headers.get('X-Authorization')).toEqual(`Bearer ${token.getToken()}`);
            done();
        });
    });

    it ('should expire token if 401 error was thrown', fakeAsync(() => {
        (authServiceSpy as any).getToken.and.returnValue(token);
        const request = new HttpRequest('GET', Endpoints.REFRESH);

        CuT.intercept(request, new DummyErrorHandler(401)).subscribe(() => {
            expect(authServiceSpy.expireToken).toHaveBeenCalled();
        });

        tick(100);
    }));

    it ('should not expire token if 401 error was not thrown', fakeAsync(() => {
        (authServiceSpy as any).getToken.and.returnValue(token);
        const request = new HttpRequest('GET', Endpoints.REFRESH);

        CuT.intercept(request, new DummyErrorHandler(400)).subscribe(() => {
            expect(authServiceSpy.expireToken).not.toHaveBeenCalled();
        });

        tick(100);
    }));
  });