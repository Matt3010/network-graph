import {Component} from '@angular/core';
import {Note, NoteService} from "../../../services/note.service";

export interface GroupedNotes {
  group: {
    letter: string; // Assuming 'letter' is the first letter of the title
    qty: number;
  };
  children: Note[];
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

  myNotes$ = this.noteService.myNotes$
  constructor(private noteService: NoteService) {}

  createNewNote() {
    this.noteService.createNewNote();
  }

}
