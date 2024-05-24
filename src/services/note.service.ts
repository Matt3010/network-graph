import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Attachment } from '../@data/attachment';

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
  filteredNotes$ = new BehaviorSubject<Note[]>([]);

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
        this.updateNotes(newNote);
        this.router.navigateByUrl('/pages/notes/edit/' + newNote.id);
      });
  }

  getMyNotes() {
    this.http.get<any>(this.apiUrl + '/all')
      .pipe(
        map((res) => res.data),
      )
      .subscribe((notes: Note[]) => {
        this.myNotes$.next(notes);
        const lastQuery = localStorage.getItem('network-last-query-search') || '';
        this.filterNotes(lastQuery);
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
            this.updateFilteredNotes();
            const lastQuery = localStorage.getItem('network-last-query-search') || '';
            this.filterNotes(lastQuery);
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

  filterNotes(query: string) {
    localStorage.setItem('network-last-query-search', query);
    this.updateFilteredNotes(query);
  }

  private updateNotes(note: Note) {
    const currentNotes = this.myNotes$.value;
    const newArray = [...currentNotes, note];
    this.myNotes$.next(newArray);
    this.updateFilteredNotes();
  }

  private updateFilteredNotes(query: string = '') {
    const filteredValue = this.myNotes$.value.filter((i: Note) => {
      return (
        i.title?.toLowerCase().includes(query.toLowerCase()) ||
        i.body?.toLowerCase().includes(query.toLowerCase())
      );
    });
    this.filteredNotes$.next(filteredValue.length > 0 ? filteredValue : this.myNotes$.value);
   }
}
