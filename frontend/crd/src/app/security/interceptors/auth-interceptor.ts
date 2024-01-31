import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, mergeMap, of, take } from "rxjs";
import { AuthService } from "../auth.service";
import { LangUtils } from "../../util/lang-utils";
import { Endpoints } from "src/app/util/http-helper";
import { Token } from "../domain/auth-objects";

/**
 * An Http Interceptor used to authenticate with the backend, refresh the token, and 
 * clear out expired tokens
 * 
 * @author Jimmy Logan <jrl9984@rit.edu>
 */
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

    /**
     * Intercepts all outgoing Http requests
     * 
     * Lets the sign in request through without modification
     * If a token exists, updates the request to include the new token in a header
     * 
     * @param req - the request being made
     * @param next - the next part of the chain
     * @returns the next part of the chain
     */
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

        // Proceed normally
        return this.handle(req, next);
    }

    /**
     * Appends the token in the header
     * 
     * @param req - the request being made
     * @param next - the next part of the chain
     * @param token - token being appended
     * @returns the next part of the chain with the updated request
     */
    private handleWithToken(req: HttpRequest<any>, next: HttpHandler, token: Token): Observable<HttpEvent<any>> {
        const updatedRequest = req.clone({...req, setHeaders: {'X-Authorization': `Bearer ${token!.getToken()}`}});
        return this.handle(updatedRequest, next);
    }

    /**
     * Catches any Http errors
     * 
     * @param req - the request being made
     * @param next - the next part of the chain
     * @returns the next part of the chain
     */
    private handle(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((event) => this.clearExpired(event)));
    }

    /**
     * if the status if 401, expire the token
     * 
     * @param event - the Http Error
     * @returns a blank response
     */
    private clearExpired(event: HttpErrorResponse): Observable<HttpResponse<any>> {
        if (event.status === 401) {
            this.authService.expireToken();
        }

        return of(new HttpResponse());
    }
}