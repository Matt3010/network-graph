import { Component } from '@angular/core';
import { Note, NoteService } from '../../../../../services/note.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  note: Note | undefined;
  text: any;
  window = window

  editForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    body: new FormControl('', []),
    created_by: new FormControl(''),
    created_at: new FormControl(''),
    updated_at: new FormControl('')
  });

  constructor(
    private noteService: NoteService,
    private activatedRoute: ActivatedRoute
  ) {
    this.getNote();

    this.editForm.valueChanges.subscribe((res: any) => {
      console.log(res)
    })
  }

  getNote() {
    combineLatest([this.noteService.myNotes$, this.activatedRoute.params])
      .subscribe(([notes, params]) => {
        this.note = notes.find((i: Note) => i.id === params['id']);
        this.note ? this.initForm(this.note) : null;
      });
  }

  initForm(noteData: Note) {
    this.editForm.setValue({
      title: noteData.title,
      body: noteData.body,
      created_by: noteData.created_by.toString(),
      created_at: noteData.created_at,
      updated_at: noteData.updated_at
    });
  }

}
