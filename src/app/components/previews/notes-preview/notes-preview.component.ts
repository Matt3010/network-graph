import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Note} from "../../../../services/note.service";
import {Router} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-notes-preview',
  templateUrl: './notes-preview.component.html',
  styleUrls: ['./notes-preview.component.scss']
})
export class NotesPreviewComponent implements OnInit{

  @Input() note!: Note;
  content!: SafeHtml;

  constructor(private sanitizer: DomSanitizer, private router: Router) {
  }

  ngOnInit() {
    const rawHtml = this.note.body || '<img width="100%" style="opacity: 0.4; filter: grayscale(0.7)" src="assets/network_assets/logo.svg" />';
    this.content = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  goTo() {
    this.router.navigateByUrl('pages/notes/edit/'+ this.note.id)
  }

}
