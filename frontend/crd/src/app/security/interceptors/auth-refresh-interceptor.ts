import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of, tap } from "rxjs";
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
                console.log(event);
                if (event instanceof HttpResponse) {
                    this.refreshSessionHeader(event);
                }

                return event;
            }),
            catchError((err: HttpErrorResponse) => {
                this.removeSessionIfFailed(err);
                return of(new HttpResponse());
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

    private removeSessionIfFailed(err: HttpErrorResponse) {
        console.log(err);
        if (err.error === "Session expired.") {
            sessionStorage.removeItem(SESSION_KEY);
            this.authService.signOut();
        }
    }
    
}