import { AuthInterceptor } from "./auth-interceptor";
import { HttpEvent, HttpEventType, HttpHandler, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { AuthRefreshInterceptor } from "./auth-refresh-interceptor";
import { AuthService } from "../auth.service";
import { TestBed } from "@angular/core/testing";

const NEW_SESSION_HEADER = 'New-Session';

class DummyHandler extends HttpHandler {

    constructor(private readonly event: any, private readonly type: HttpEventType) {
        super();
    }

    override handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        //@ts-ignore
        return of({...this.event, type: this.type});
    }
}

fdescribe('AuthRefreshInterceptor', () => {
    let CuT: AuthRefreshInterceptor;
    let authService;
  
    beforeEach(() => {
        authService = jasmine.createSpyObj('AuthService', ['signOut']);  
        TestBed.configureTestingModule({
            providers: [
                {provide: AuthService, useValue: authService},
                AuthRefreshInterceptor
            ], // Include the service to be tested
        });
        CuT = TestBed.inject(AuthRefreshInterceptor);
    });
  
    it('should be created', () => {
      expect(CuT).toBeTruthy();
    });

    it('should add new session', (done) => {
        spyOn(sessionStorage, 'setItem')

        const response = new HttpResponse()

         //@ts-ignore
        response.headers = new HttpHeaders({'New-Session': 'new'});
        const handler = new DummyHandler(response, HttpEventType.Response);
        const request = new HttpRequest('GET', '/test');

        CuT.intercept(request, handler).subscribe((res) => {
            expect(sessionStorage.setItem).toHaveBeenCalled();
            done();
        });
    });

    it('should not add new session', (done) => {
        spyOn(sessionStorage, 'setItem')

        const response = new HttpResponse()
        const handler = new DummyHandler(response, HttpEventType.Response);
        const request = new HttpRequest('GET', '/test');

        CuT.intercept(request, handler).subscribe((res) => {
            expect(sessionStorage.setItem).not.toHaveBeenCalled();
            done();
        });
    });
  });