import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  setToken(token: string) {
    localStorage.setItem('accessToken', token)
  }

  getToken(): string {
    return localStorage.getItem('accessToken')!
  }

  removeToken() {
    localStorage.removeItem('accessToken')
  }

}
