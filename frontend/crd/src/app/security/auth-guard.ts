import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree, createUrlTreeFromSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { map, mergeMap, zip, zipWith } from "rxjs";
import { LangUtils } from "../util/lang-utils";
import { User } from "./domain/user";

/**
 * The guard that prevents routes from being reached when not authenticated
 */
export const authGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AuthService);
    return authService.isAuthenticated$.pipe(
        map((isAuthenticated) => {
            if (!isAuthenticated) return createUrlTreeFromSnapshot(next.root, ['login'], {
                attempted: location.pathname + encodeURI(location.search)
            });
            return true;
        }),
        zipWith(authService.user$),
        map((result) => {
            const res = result[0];
            if (res instanceof UrlTree) return res;

            const user = result[1] as User;
            if (!user.signedUp) return createUrlTreeFromSnapshot(next.root, ['signup']);
            return res && user.signedUp;
        }),
    );
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
            if (user!.faculty || user!.admin) return true;
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
            if (user!.admin) return true;
        }
        return createUrlTreeFromSnapshot(next.root, ['dashboard']);
    }));
}

export const signedUpGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AuthService);
    return authService.user$.pipe(map((user) => {
        if (user?.signedUp) return createUrlTreeFromSnapshot(next.root, ['dashboard']);
        return true;
    }));
}