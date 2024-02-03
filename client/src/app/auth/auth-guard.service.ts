import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChildFn } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable, switchMap, of } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.isRouteAuthenticated().then((isRouteAuthenticated: any) => {
            if(isRouteAuthenticated){
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        })
    }
}