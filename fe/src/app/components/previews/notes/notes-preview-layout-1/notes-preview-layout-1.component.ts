import {Component, Input, OnInit} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Note} from "../../../../../services/note.service";
import {Router} from "@angular/router";
import {ComponentInjectorService} from "../../../../../services/utils/component-injector.service";
import {MdSmComponent} from "../../../modals-templates/md-sm/md-sm.component";
import {EditComponent} from "../../../../pages/notes-edit/edit.component";
import {LoginComponent} from "../../../../pages/login/login.component";
import {NoteMenuModalComponent} from "../../../modals/note-menu-modal/note-menu-modal.component";
import {NotesComponent} from "../../../../pages/notes/notes.component";

@Component({
  selector: 'app-notes-preview-layout-1',
  templateUrl: './notes-preview-layout-1.component.html',
  styleUrls: ['./notes-preview-layout-1.component.scss']
})
export class NotesPreviewLayout1Component implements OnInit {

  @Input() note!: Note;
  content!: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private componentInjector: ComponentInjectorService) {
  }

  ngOnInit() {
    const rawHtml = this.note.body || '<img width="100%" style="opacity: 0.4; filter: grayscale(0.7)" src="assets/network_assets/logo.svg" />';
    this.content = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  goTo() {
    this.router.navigateByUrl('pages/notes/edit/' + this.note.id)
  }

  openDropDown() {
    const component = NoteMenuModalComponent;
    this.componentInjector.createComponent(MdSmComponent, {component: component, title: this.note.body.split(' ').splice(0, 10).concat(' ')});
  }


  checkIfAttachmentsExists() {
    if (this.note.attachments && this.note.attachments.length > 0) {
      return true
    } else {
      return false
    }
  }

}
