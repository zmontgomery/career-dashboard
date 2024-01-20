import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, mergeMap, of, take } from "rxjs";
import { AuthService, Token } from "../auth.service";
import { LangUtils } from "../../util/lang-utils";
import { Endpoints } from "src/app/util/http-helper";

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
    ) {
        this.handleWithToken = this.handleWithToken.bind(this);
        this.handle = this.handle.bind(this);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Immediately let the sign in through
        if (req.url.includes(Endpoints.SIGN_IN)) return this.handle(req, next);

        let token = this.authService.getToken();
        if (LangUtils.exists(token)) {
            // Don't check for expiry and immediately let the refresh through
            if (req.url.includes(Endpoints.REFRESH)) return this.handleWithToken(req, next, token!);

            // Every other request perform an expiry check
            return this.authService.expiryCheck().pipe(
                take(1),
                mergeMap((t) => {
                    return this.handleWithToken(req, next, t!);
                }),
            );
        } 

        return this.handle(req, next);
    }

    private handleWithToken(req: HttpRequest<any>, next: HttpHandler, token: Token): Observable<HttpEvent<any>> {
        const updatedRequest = req.clone({...req, setHeaders: {'X-Authorization': `Bearer ${token!.getToken()}`}});
        return this.handle(updatedRequest, next);
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