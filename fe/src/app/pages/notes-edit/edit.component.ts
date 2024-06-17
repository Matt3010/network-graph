import {Component, OnDestroy} from '@angular/core';
import {Note, NoteService} from '../../../services/note.service';
import {ActivatedRoute} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';

export interface FormStatistics {
  Chars: number;
  Words: number;
  Paragraphs: number;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnDestroy {
  note!: Note | undefined;
  id: string | null = null;
  window = window;


  editForm = new FormGroup({
    body: new FormControl(''),
    created_by: new FormControl(''),
    created_at: new FormControl(''),
    updated_at: new FormControl('')
  });

  constructor(
    private noteService: NoteService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.editForm.reset();
    this.getNote();
    this.editForm.valueChanges.pipe(debounceTime(700))
      .subscribe(() => {
        if (this.editForm.dirty) {
          this.save();
        }
      });
  }

  ngOnDestroy() {
    this.editForm.reset();
  }


  getNow() {
    return new Date();
  }

  getNote() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      this.noteService.find(this.id!).subscribe((res: Note) => {
        this.initForm(res);
        this.note = res;
      });
    });
  }


  initForm(noteData: Note) {
    this.editForm.setValue({
      body: noteData.body,
      created_by: noteData.created_by,
      created_at: noteData.created_at,
      updated_at: noteData.updated_at
    });
  }

  save() {
    this.noteService.saveNote({
      id: this.id!,
      body: this.editForm.value.body!,
      created_by: this.editForm.value.created_by!,
      created_at: this.editForm.value.created_at!,
      updated_at: this.editForm.value.updated_at!,
      attachments: this.note?.attachments!,
    })
  }


}
