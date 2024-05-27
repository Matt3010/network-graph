import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {TokenService} from "../token.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.tokenService.getToken();

    const authReq = authToken ? req.clone({
      headers: req.headers.set('Authorization', ` Bearer ${authToken}`)
    }) : req;

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
