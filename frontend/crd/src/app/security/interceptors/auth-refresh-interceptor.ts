import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { AuthService, SESSION_KEY } from "../auth.service";

export const NEW_SESSION_HEADER = 'New-Session';
export const REMOVE_SESSION_HEADER = 'Session-Expired'

@Injectable({
    providedIn: 'root',
})
export class AuthRefreshInterceptor implements HttpInterceptor {

    constructor (private readonly authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map((event) => {
                if (event instanceof HttpResponse) {
                    this.refreshSessionHeader(event);
                    this.removeSessionIfFailed(event);
                }
                return event;
            }),
        );
    }

    //
    // Helper methods
    //

    private refreshSessionHeader(event: HttpResponse<any>) {
        if (event.headers.has(NEW_SESSION_HEADER)) {
            const newKey = event.headers.get(NEW_SESSION_HEADER)!;
            sessionStorage.setItem(SESSION_KEY, newKey);
        }
    }

    private removeSessionIfFailed(event: HttpResponse<any>) {
        console.log(event.headers);
        if (event.headers.has(REMOVE_SESSION_HEADER)) {
            console.log('hello there');
            const newKey = event.headers.get(NEW_SESSION_HEADER)!;
            const currKey = sessionStorage.getItem(SESSION_KEY);
            if (newKey === currKey) sessionStorage.removeItem(SESSION_KEY);
        }
    }
    
}