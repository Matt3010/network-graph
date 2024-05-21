import {Component} from '@angular/core';
import {NoteService} from "../../services/note.service";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {

  constructor(
    private noteService: NoteService,
  ) {
  }

  createNewNote() {
    this.noteService.createNewNote()
  }

}
