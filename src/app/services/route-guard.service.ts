import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import jwt_decode from "jwt-decode";
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth: AuthService,
    public router: Router,
    private snackbarservice: SnackbarService) { }

  canActivate(router: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = router.data;
    expectedRoleArray = expectedRoleArray.expectedRole;
    const token: any = localStorage.getItem('token');

    var tokenPayload: any;
    try {
      tokenPayload = jwt_decode(token);
    }
    catch (err) {
      localStorage.clear();
      this.router.navigate(['/']);

    }
    let expectedRole = '';
    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        expectedRole = tokenPayload.role; 
      }

    }

    if (['user', 'admin', 'Employee'].includes(tokenPayload.role)) {
      if (this.auth.isAuthenticated()) {
        return true;
      }
      this.snackbarservice.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
      this.router.navigate(['/cafe/dashboard']);
      return false;
    }
    else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }

  }

  getUserRole(): string {
    const token: any = localStorage.getItem('token');
    let tokenPayload: any;

    try {
      tokenPayload = jwt_decode(token);
    } catch (err) {
      return ''; // Return an empty string if there's an error or no token
    }

    return tokenPayload.role;
  }
}
