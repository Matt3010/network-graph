import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {TokenService} from './token.service';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
import {DocumentService} from "./document.service";
import {UploadingProgressService} from "./utils/uploading-progress.service";
import {CanUpload, UploadUtils} from "./utils/upload.utils";

export interface Note extends CanUpload {
  title: string;
  body: string;
  created_by: string;
  created_at: string;
  updated_at: string;
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
    private documentService: DocumentService,
    private uploadProgressService: UploadingProgressService,
    private uploadUtils: UploadUtils,
  ) {
    this.apiUrl = environment.api_url + '/notes';
    this.init();
  }

  init() {
    this.getMyNotes();
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

  getMyNotes() {
    const sort = localStorage.getItem('network-sort-filter') ? localStorage.getItem('network-sort-filter') : ''
    const query = localStorage.getItem('network-query-filter') ? localStorage.getItem('network-query-filter') : ''

    this.http.get<any>(this.apiUrl + '/all?q=' + query + '&s='+sort)
      .pipe(
        map((res) => res.data),
        map((data: any) => data.map((note: any) => ({
          id: note.id,
          title: note.title,
          body: note.body,
          created_by: note.created_by,
          created_at: note.created_at,
          updated_at: note.updated_at,
          attachments: note.attachments.data.map((attachment: any) => ({
            id: attachment.id,
            url: attachment.url,
            default_url: attachment.default_url,
            created_at: attachment.created_at,
            updated_at: attachment.updated_at
          }))
        })))
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

  uploadDocument(file: File, id: string) {
    this.uploadUtils.upload(this.apiUrl, file, null, id, this.myNotes$)
  }

}
