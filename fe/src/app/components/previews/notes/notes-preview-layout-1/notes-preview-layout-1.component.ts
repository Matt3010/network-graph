import {Component, Input, OnInit} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Note} from "../../../../../services/note.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notes-preview-layout-1',
  templateUrl: './notes-preview-layout-1.component.html',
  styleUrls: ['./notes-preview-layout-1.component.scss']
})
export class NotesPreviewLayout1Component implements OnInit{

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

  openDropDown() {
    console.log('ciao')
  }

  checkIfAttachmentsExists() {
    if (this.note.attachments && this.note.attachments.length > 0) {
      return true
    } else {
      return false
    }
  }

}
