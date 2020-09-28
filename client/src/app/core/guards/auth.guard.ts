import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.currentUser$.pipe(  // currentUser$ is self observable
      map(auth => {
        if (auth) { // if auth is not empty we have logged in user
          return true;
        } // else navigate user to login form from proceed checkout
        this.router.navigate(['account/login'], {queryParams: {returnUrl: state.url}});
      })
    );
  }
}
