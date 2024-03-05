import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, createUrlTreeFromSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { map } from "rxjs";
import { LangUtils } from "../util/lang-utils";

/**
 * The guard that prevents routes from being reached when not authenticated
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

/**
 * The guard that prevents a user from going to the login page if they are already signed in
 */
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

/**
 * The guard that only allows faculty through
 */
export const facultyRoleGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AuthService);
    return authService.user$.pipe(map((user) => {
        if (LangUtils.exists(user)) {
            if (user!.hasFacultyPrivileges()) return true;
        }
        return createUrlTreeFromSnapshot(next.root, ['dashboard']);
    }));
}

/**
 * The guard that only allows admins to access the page
 */
export const adminRoleGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AuthService);
    return authService.user$.pipe(map((user) => {
        if (LangUtils.exists(user)) {
            if (user!.hasAdminPrivileges()) return true;
        }
        return createUrlTreeFromSnapshot(next.root, ['dashboard']);
    }));
}
