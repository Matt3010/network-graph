import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {TokenService} from "./token.service";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";
import {BehaviorSubject, map} from "rxjs";

export interface CloudElement {
  type: string;
  path: string;
  signed_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  apiUrl;
  manager$ = new BehaviorSubject<CloudElement[]>([]);

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.apiUrl = environment.api_url + '/cloud';
  }

  navigate(dir_to_go: string) {
    this.http.get<CloudElement[]>(this.apiUrl + '/' + dir_to_go)
      .pipe(
        map((res: any) => {
          if (res) return res.data;
          else return null;
        }),
      )
      .subscribe(
        (res: CloudElement[]) => {
          if (res.length === 0) {
            this.router.navigateByUrl('pages/cloud');
            this.navigate('');
          }
          this.manager$.next(res);
        },
      );
  }


  public deleteFile(path: string) {
    console.log(path);
    this.http.delete(`${this.apiUrl}/file/` + path).subscribe(res => {

    });
  }
  public deleteDir(path: string) {
    console.log(path);
    this.http.delete(`${this.apiUrl}/dir/` + path).subscribe(res => {
    });
  }


}
