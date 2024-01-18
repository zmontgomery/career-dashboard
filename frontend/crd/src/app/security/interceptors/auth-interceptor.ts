import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, defaultIfEmpty, flatMap, map, mergeMap } from "rxjs";
import { AuthService, SESSION_KEY } from "../auth.service";
import { LangUtils } from "../../util/lang-utils";

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req.url);
        if (req.url.includes('signIn')) return next.handle(req);

        const token = this.authService.getToken();

        if (LangUtils.exists(token)) {
            this.authService.expiryCheck(req.url);

            return this.authService.refreshCheck$.pipe(
                mergeMap(() => {
                    const updatedRequest = req.clone({...req, setHeaders: {'X-Authorization': token!.getToken()}});
                    return next.handle(updatedRequest);    
                })
            );
        } else {
            return next.handle(req);
        }
    }
}