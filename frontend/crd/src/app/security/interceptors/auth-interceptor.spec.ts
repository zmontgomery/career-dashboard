import { AuthInterceptor } from "./auth-interceptor";
import { HttpEvent, HttpEventType, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable, of } from "rxjs";

class DummyHandler extends HttpHandler {
    override handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return of({type: HttpEventType.Sent, request: req});
    }
}

describe('AuthInterceptor', () => {
    let CuT: AuthInterceptor;
  
    beforeEach(() => {
      CuT = new AuthInterceptor();
    });
  
    it('should be created', () => {
      expect(CuT).toBeTruthy();
    });

    it('should add key from session storage', (done) => {
        spyOn(sessionStorage, 'getItem').and.returnValue('session');

        const request = new HttpRequest('GET', '/api/dummy')

        CuT.intercept(request, new DummyHandler()).subscribe((res) => {
            const request = (res as any)['request'] as HttpRequest<any>;
            expect(request.headers.has('Session-ID')).toBeTrue();
            expect(request.headers.get('Session-ID')).toEqual('session');
            done();
        });
    });

    it('should not add key if it does not exists', (done) => {
        spyOn(sessionStorage, 'getItem').and.returnValue(null);

        const request = new HttpRequest('GET', '/api/dummy')

        CuT.intercept(request, new DummyHandler()).subscribe((res) => {
            const request = (res as any)['request'] as HttpRequest<any>;
            expect(request.headers.has('Session-ID')).toBeFalse();
            done();
        });
    })
  });