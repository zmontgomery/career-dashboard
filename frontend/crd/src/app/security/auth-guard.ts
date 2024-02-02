import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlSegmentGroup, UrlTree, createUrlTreeFromSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { Inject, inject } from "@angular/core";
import { map, take, tap } from "rxjs";

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
    return authService.isAuthenticated$.pipe(take(1), map((isAuthenticated) => {
        console.log(next);
        console.log(next.url.map((p) => p.path).join('/'));
        if (!isAuthenticated) return createUrlTreeFromSnapshot(next.root, ['login'], {
            attempted: next.url.map((p) => p.path).join('/')
        });
        return true;
    }));
}

export const noAuthGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const authService = inject(AuthService);
    return authService.isAuthenticated$.pipe(take(1), map((isAuthenticated) => {
        if (isAuthenticated) return createUrlTreeFromSnapshot(next.root, ['dashboard']);
        return true;
    }));
}