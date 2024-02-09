import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlSegmentGroup, UrlTree, createUrlTreeFromSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { Inject, inject } from "@angular/core";
import { map, take, tap } from "rxjs";
import { LangUtils } from "../util/lang-utils";

/**
 * The guard that prevents routes from being reached when not authenticated
 * 
 * @returns if the user is authenticated
 */
export const authGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AuthService);
    return authService.isAuthenticated$.pipe(map((isAuthenticated) => {
        if (!isAuthenticated) return createUrlTreeFromSnapshot(next.root, ['login'], {
            attempted: location.pathname + encodeURI(location.search)
        });
        return true;
    }));
}

export const noAuthGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AuthService);
    return authService.isAuthenticated$.pipe(map((isAuthenticated) => {
        if (isAuthenticated) return createUrlTreeFromSnapshot(next.root, ['dashboard']);
        return true;
    }));
}

export const facultyRoleGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AuthService);
    return authService.user$.pipe(map((user) => {
        if (LangUtils.exists(user)) {
            if (user!.faculty || user!.admin) return true;
        }
        return createUrlTreeFromSnapshot(next.root, ['dashboard']);
    }));
}

export const adminRoleGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AuthService);
    return authService.user$.pipe(map((user) => {
        if (LangUtils.exists(user)) {
            if (user!.admin) return true;
        }
        return createUrlTreeFromSnapshot(next.root, ['dashboard']);
    }));
}