import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { SESSION_KEY } from "../auth.service";

export const NEW_SESSION_HEADER = 'New-Session';
export const REMOVE_SESSION_HEADER = 'Session-Expired'

@Injectable({
    providedIn: 'root',
})
export class AuthRefreshInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map((event) => {
                if (event instanceof HttpResponse) {
                    if (event.headers.has(NEW_SESSION_HEADER)) {
                        const newKey = event.headers.get(NEW_SESSION_HEADER)!;
                        sessionStorage.setItem(SESSION_KEY, newKey);
                    }

                    if (event.headers.has(REMOVE_SESSION_HEADER)) {
                        const val = event.headers.get(REMOVE_SESSION_HEADER)!;
                        if (val === 'true') {
                            sessionStorage.removeItem(SESSION_KEY);
                        }
                    }
                }
                return event;
            }),
        );
    }
}