import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SESSION_KEY } from "../auth.service";
import { LangUtils } from "../../util/lang-utils";

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const sessionID = sessionStorage.getItem(SESSION_KEY);

        if (LangUtils.exists(sessionID)) {
            const updatedRequest = req.clone({...req, setHeaders: {'Session-ID': sessionID!}});
            return next.handle(updatedRequest);    
        }

        return next.handle(req);
    }
}