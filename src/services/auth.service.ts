import {Injectable} from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {TokenService} from "./token.service";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: any
  created_at: string
  updated_at: string,
  image_path: string
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string;
  currentUser$ = new BehaviorSubject<User | null>(null)

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.apiUrl = environment.api_url + '/auth';
    if (!this.currentUser$.value) {
      this.me()
    }
  }

  login(body: any) {
    this.http.post(this.apiUrl + '/login', body)
      .subscribe((res) => {
        this.handleLoginSuccess(res)
        this.toastrService.success('Logged in successfully.', 'Success', {
          positionClass: 'toast-top-left',
        })
        console.log(res);
      }, (err) => {
        if (err.status === 422) {
          this.toastrService.error(err.error.message, 'Error', {
            positionClass: 'toast-top-left',
          })
        } else if (err.status === 401 && !err.error.message) {
          this.toastrService.error('Invalid credentials...', 'Error', {
            positionClass: 'toast-top-left',
          })
        } else if (err.status === 404 ) {
          this.toastrService.error('Email not found! You must register before.', 'Error', {
            positionClass: 'toast-top-left',
          })
        }
      })
  }

  me() {
      this.http.get<User>(environment.api_url + '/me').subscribe(
        (res: User) => {
          this.currentUser$.next(res);
        },
        (err) => {
          this.logout();
        })
  }

  handleLoginSuccess(res: any) {
    this.tokenService.setToken(res.token);
    this.currentUser$.next(res.user);
    this.router.navigateByUrl('/pages/home')
  }

  logout() {
    this.tokenService.removeToken();
    this.currentUser$.next(null);
    this.router.navigateByUrl('/auth/login')
  }

}
