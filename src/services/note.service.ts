import {Injectable} from '@angular/core';
import {BehaviorSubject, debounce, debounceTime, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {TokenService} from "./token.service";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";


export interface Note {
  id: string
  title: string
  body: string
  created_by: number
  created_at: string
  updated_at: string
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  apiUrl: string;
  myNotes$ = new BehaviorSubject<Note[]>([])

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.apiUrl = environment.api_url + '/notes';
    this.getMyNotes();
  }

  createNewNote() {
    this.http.get<{ data: Note }>(this.apiUrl)
      .pipe(
        map((res) => res.data),
        debounceTime(1500)
      )
      .subscribe((newNote: Note) => {
        const currentNotes = this.myNotes$.value;
        const newArray = [...currentNotes, newNote];
        this.myNotes$.next(newArray);
        this.router.navigateByUrl('/pages/notes/edit/' + newNote.id)
      });
  }

  getMyNotes() {
    this.http.get<any>(this.apiUrl+ '/all')
      .pipe(
        map((res) => res.data)
      )
      .subscribe((notes: Note[]) => {
        this.myNotes$.next(notes);
      });
  }

}
