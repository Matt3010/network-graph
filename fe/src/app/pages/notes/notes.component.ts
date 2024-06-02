import {Component} from '@angular/core';
import {NoteService} from "../../../services/note.service";
import {map} from "rxjs";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

  myNotes$ = this.noteService.myNotes$
  query!: string;

  constructor(public noteService: NoteService) {
  }

  createNewNote() {
    this.noteService.createNewNote();
  }

  filter() {
    return this.myNotes$.pipe(
      map(notes => {
        if (this.query && this.query.trim()) {
          const filteredNotes = notes.filter(note => note.title.includes(this.query));
          return filteredNotes.length > 0 ? filteredNotes : notes;
        }
        return notes;
      })
    );
  }

}
