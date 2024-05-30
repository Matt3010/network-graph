import {Component, Input} from '@angular/core';
import {Note} from "../../../../../services/note.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notes-layout-1',
  templateUrl: './notes-layout-1.component.html',
  styleUrls: ['./notes-layout-1.component.scss']
})
export class NotesLayout1Component {

  @Input() notes!: Note[];

  constructor(
    private router: Router,
  ) {}


}
