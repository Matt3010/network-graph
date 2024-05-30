import { Component } from '@angular/core';
import {NoteService} from "../../../../services/note.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    public noteService: NoteService
  ) {
  }

}
