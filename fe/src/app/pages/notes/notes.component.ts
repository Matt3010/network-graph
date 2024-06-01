import {Component} from '@angular/core';
import {NoteService} from "../../../services/note.service";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

  myNotes$ = this.noteService.myNotes$

  constructor(public noteService: NoteService) {
  }

  createNewNote() {
    this.noteService.createNewNote();
  }

}
