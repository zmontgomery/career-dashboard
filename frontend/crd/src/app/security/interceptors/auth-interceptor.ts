import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, mergeMap, of } from "rxjs";
import { AuthService } from "../auth.service";
import { LangUtils } from "../../util/lang-utils";

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('signIn')) return next.handle(req);

        let token = this.authService.getToken();

        if (LangUtils.exists(token)) {
            this.authService.expiryCheck(req.url);

            return this.authService.refreshCheck$.pipe(
                mergeMap(() => {
                    console.log(token);
                    const updatedRequest = req.clone({...req, setHeaders: {'X-Authorization': `Bearer ${token!.getToken()}`}});
                    return this.handle(updatedRequest, next);
                })
            );
        } else {
            return this.handle(req, next)
        }
    }

    private handle(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((event) => this.clearExpired(event)));
    }

    private clearExpired(event: HttpErrorResponse): Observable<HttpResponse<any>> {
        if (event.status === 401) {
            this.authService.expireToken();
        }

        return of(new HttpResponse());
    }
}