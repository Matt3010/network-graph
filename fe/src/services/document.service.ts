import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {TokenService} from "./token.service";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";
import {Note} from "./note.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  apiUrl: string;
  myNotes$ = new BehaviorSubject<Note[]>([]);
  notesSearchNotFound$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.apiUrl = environment.api_url + '/documents';
  }

  checkIfDocuemntExist(path: string) {
    return this.http.post(this.apiUrl + '/check', {path})
  }


}
