import { Injectable } from '@angular/core';
import {Router, ActivatedRoute, Route, RouterState} from '@angular/router';
import {Token} from "@angular/compiler";
import {TokenService} from "../token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private router: Router, private tokenService: TokenService) { }

  canActivate(route: ActivatedRoute, state: RouterState): boolean {
    if (!this.tokenService.getToken()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }

}
