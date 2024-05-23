import {Injectable} from '@angular/core';
import {BehaviorSubject, debounceTime, map, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {TokenService} from "./token.service";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";


export interface Note {
  id: string
  title: string
  body: string
  created_by: string
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
      )
      .subscribe((newNote: Note) => {
        const currentNotes = this.myNotes$.value;
        const newArray = [...currentNotes, newNote];
        this.myNotes$.next(newArray);
        this.router.navigateByUrl('/pages/notes/edit/' + newNote.id)
      });
  }

  getMyNotes() {
    this.http.get<any>(this.apiUrl + '/all')
      .pipe(
        map((res) => res.data)
      )
      .subscribe((notes: Note[]) => {
        this.myNotes$.next(notes);
      });
  }

  saveNote(noteUpdated: Note) {
    return this.http.patch<string>(this.apiUrl + '/' + noteUpdated.id, noteUpdated).pipe(
      tap((res: string) => {
        if (res === 'saved') {

          const current = this.myNotes$.value;
          const index = current.findIndex((i)=> i.id === noteUpdated.id)
          if(index !== -1) {
            this.myNotes$.value[index] = noteUpdated
            this.myNotes$.next([...this.myNotes$.value])
          }
        }
      })
    )
  }


  find(id: string) {
    return this.http.get<Note>(this.apiUrl + '/' + id)
      .pipe(
        map((res: any) => res.data)
      )
  }



}
