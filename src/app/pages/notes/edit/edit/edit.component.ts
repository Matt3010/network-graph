import {Component, HostListener, OnDestroy} from '@angular/core';
import {Note, NoteService} from '../../../../../services/note.service';
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
  isWriting = false;
  hasSaved: boolean = false;
  id: string | null = null;
  window = window;
  statistics: FormStatistics = {
    Chars: 0,
    Words: 0,
    Paragraphs: 0
  };
  isLock: boolean = false;

  editForm = new FormGroup({
    title: new FormControl(''),
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

    this.editForm.valueChanges.subscribe(() => {
      this.updateStats();
      this.hasSaved = false;
    });
  }

  ngOnDestroy() {
    this.editForm.reset();
  }

  updateStats() {
    this.getBodyChars();
    this.getBodyWords();
    this.getBodyParagraphs();
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
    this.noteService.saveNote({
      id: this.id!,
      title: this.editForm.value.title!,
      body: this.addClassToImages(this.editForm.value.body!),
      created_by: this.editForm.value.created_by!,
      created_at: this.editForm.value.created_at!,
      updated_at: this.editForm.value.updated_at!,
    }).subscribe((res) => {
      if (res === 'saved') {
        this.hasSaved = true;
      }
    });
  }

  private addClassToImages(body: string): string {
    return body === null ? '' : body.replace(/<img/g, '<img class="content-img"');
  }


  getBodyChars() {
    const body = this.editForm.controls.body.value || '';
    const bodyText = this.stripHtmlTags(body).replace(/\s/g, '');
    this.statistics.Chars = bodyText.length;
  }

  getBodyWords() {
    const body = this.editForm.controls.body.value || '';
    const bodyText = this.stripHtmlTags(body);
    const words = bodyText.match(/\b\w+\b/g);
    this.statistics.Words = words ? words.length : 0;
  }

  getBodyParagraphs() {
    const body = this.editForm.controls.body.value || '';
    const paragraphs = body.split(/\s*<p>\s*<br>\s*<\/p>\s*/g).filter(Boolean);
    this.statistics.Paragraphs = paragraphs.length;
  }

  stripHtmlTags(html: string): string {
    return html.replace(/(<([^>]+)>)/gi, '');
  }

  @HostListener('document:keydown.control.s', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 83 && event.ctrlKey) {
      event.preventDefault();
      this.save();
    }
  }
}
