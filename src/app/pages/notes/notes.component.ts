import {Component} from '@angular/core';
import {Note, NoteService} from "../../../services/note.service";

export interface GroupedNotes {
  group: {
    letter: string,
    qty: number
  };
  children: Note[];
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

  myGroupedNotes: GroupedNotes[] = [];
  myNotes$ = this.noteService.myNotes$


  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.noteService.myNotes$.subscribe((res: Note[]) => {

      res.sort((a, b) => a.title.localeCompare(b.title));

      let i = 0;
      const grouped = res.reduce((acc: { [key: string]: GroupedNotes }, note) => {
        const group = note.title[0].toUpperCase();
        if (!acc[group]) {
          acc[group] = { group: {letter: group, qty: 1}, children: [note] }; // Initialize quantity to 1
        } else {
          acc[group].children.push(note);
          acc[group].group.qty++; // Increment quantity
        }
        return acc;
      }, {});

      this.myGroupedNotes = Object.values(grouped);
    });
  }
}
