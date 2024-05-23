import {Component, HostListener, OnDestroy} from '@angular/core';
import {Note, NoteService} from '../../../../../services/note.service';
import {ActivatedRoute} from '@angular/router';
import {combineLatest} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

export interface FormStatistics {
  Chars: number,
  Words: number,
  Paragraphs: number
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnDestroy {
  note: Note | undefined;
  isWriting = false;
  hasSaved: boolean = false;
  id: string | null = null;
  window = window;
  statistics: FormStatistics = {
    Chars: 0,
    Words: 0,
    Paragraphs: 0
  }
  isLock: boolean = false;

  editForm = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl(''),
    created_by: new FormControl(''),
    created_at: new FormControl(''),
    updated_at: new FormControl('')
  });

  constructor(
    private noteService: NoteService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.initializeLock();

    this.editForm.reset();
    this.getNote();
    this.editForm.valueChanges.pipe(debounceTime(500))
      .subscribe(() => {
        if (this.editForm.touched) {
          this.hasSaved = false;
          this.save();
        }
      });
    this.editForm.valueChanges.subscribe((res: any) => {
      this.updateStats();
      this.hasSaved = false;
    })
  }

  ngOnDestroy() {
    this.editForm.reset();
  }

  updateStats() {
    this.getBodyChars();
    this.getBodyWords();
    this.getBodyParagraphs(); // Aggiunto il conteggio dei paragrafi
  }

  getNote() {
    combineLatest([this.noteService.myNotes$, this.activatedRoute.params]).subscribe(([notes, params]) => {
      this.id = params['id'];
      this.note = notes.find((i: Note) => i.id === params['id']);
      if (this.note) this.initForm(this.note);
    });
  }

  initializeLock() {
    this.isLock = JSON.parse(localStorage.getItem('network-locked')!)!;
  }

  toggleLock() {
    this.isLock = !this.isLock;
    localStorage.setItem('network-locked', JSON.stringify(this.isLock));
  }

  initForm(noteData: Note) {
    this.editForm.setValue({
      title: noteData.title,
      body: noteData.body,
      created_by: noteData.created_by,
      created_at: noteData.created_at,
      updated_at: noteData.updated_at
    });
  }

  save() {
    if (this.id && this.editForm.valid) {
      this.noteService.saveNote({
          id: this.id,
          title: this.editForm.value.title!,
          body: this.editForm.value.body!,
          created_by: this.editForm.value.created_by!,
          created_at: this.editForm.value.created_at!,
          updated_at: this.editForm.value.updated_at!,
        }).subscribe((res) => {
          if (res === 'saved') {
            this.hasSaved = true;
          }
      })
    }
  }

  getBodyChars() {
    const body = this.editForm.controls.body.value || '';
    const bodyText = this.stripHtmlTags(body).replace(/\s/g, ''); // Rimuovi i tag HTML e gli spazi bianchi
    this.statistics.Chars = bodyText.length;
  }

  getBodyWords() {
    const body = this.editForm.controls.body.value || '';
    const bodyText = this.stripHtmlTags(body); // Rimuovi i tag HTML
    const words = bodyText.match(/\b\w+\b/g);
    this.statistics.Words = words ? words.length : 0;
  }


  getBodyParagraphs() {
    const body = this.editForm.controls.body.value || '';
    const paragraphs = body.split(/\s*<p>\s*<br>\s*<\/p>\s*/g).filter(Boolean); // Dividere i paragrafi utilizzando il pattern <p><br></p>
    this.statistics.Paragraphs = paragraphs.length;
  }

  stripHtmlTags(html: string): string {
    // Rimuove tutti i tag HTML dalla stringa HTML
    return html.replace(/(<([^>]+)>)/gi, '');
  }


  @HostListener('document:keydown.control.s', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 83 && event.ctrlKey) {
      this.save();
    }
  }

}
