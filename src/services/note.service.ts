import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {TokenService} from './token.service';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
import {Attachment} from '../@data/attachment';

export interface Note {
  id: string;
  title: string;
  body: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  attachments?: Attachment;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  apiUrl: string;
  myNotes$ = new BehaviorSubject<Note[]>([]);
  notesSearchNotFound$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.apiUrl = environment.api_url + '/notes';
    this.init();
  }

  init() {
    const last = localStorage.getItem('network-last-query-search')
    if (last) {
      this.getMyNotes(last)
    } else {
      this.getMyNotes('')
    }
  }

  createNewNote() {
    this.http.get<{ data: Note }>(this.apiUrl)
      .pipe(
        map((res) => res.data),
      )
      .subscribe((newNote: Note) => {
        this.updateNotes(newNote);
        this.router.navigateByUrl('/pages/notes/edit/' + newNote.id);
      });
  }

  getMyNotes(query?: string) {
    this.http.get<any>(this.apiUrl + '/all?q=' + query)
      .pipe(
        map((res) => res.data),
      )
      .subscribe((notes: Note[]) => {
          this.notesSearchNotFound$.next(false);
          this.myNotes$.next(notes);
        },
        (err) => {
          if (err.status === 404) {
            this.notesSearchNotFound$.next(true);
            this.myNotes$.next([]);
          }
        });
  }

  saveNote(noteUpdated: Note) {
    return this.http.patch<string>(this.apiUrl + '/' + noteUpdated.id, noteUpdated).pipe(
      tap((res: string) => {
        if (res === 'saved') {
          const current = this.myNotes$.value;
          const index = current.findIndex((i) => i.id === noteUpdated.id)
          if (index !== -1) {
            current[index] = noteUpdated;
            this.myNotes$.next([...current]);
          }
        }
      })
    )
  }

  find(id: string): Observable<Note> {
    return this.http.get<Note>(this.apiUrl + '/' + id)
      .pipe(
        map((res: any) => res.data)
      );
  }

  private updateNotes(note: Note) {
    const currentNotes = this.myNotes$.value;
    const newArray = [...currentNotes, note];
    this.myNotes$.next(newArray);
  }


}
