import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { SESSION_KEY } from "./auth.service";

export const NEW_SESSION = 'NewSession';

@Injectable({
    providedIn: 'root',
})
export class AuthRefreshInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map((event) => {
                console.log(event);
                if (event instanceof HttpResponse) {
                    if (event.headers.has(NEW_SESSION)) {
                        const newKey = event.headers.get(NEW_SESSION)!;
                        sessionStorage.setItem(SESSION_KEY, newKey);
                    }
                }
                return event;
            }),
        );
    }
}