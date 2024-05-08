import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string;
  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = environment + '/auth';
  }


  login(body: any) {
    this.http.post(this.apiUrl + '/login', body)
      .subscribe((res) => {
          console.log(res);
    })
  }

}
