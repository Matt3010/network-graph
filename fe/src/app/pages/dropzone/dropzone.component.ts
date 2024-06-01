import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NoteService } from "../../../services/note.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {UploadingProgressService} from "../../../services/utils/uploading-progress.service";
import {DocumentService} from "../../../services/document.service";

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit, OnDestroy {
  private lastTarget: EventTarget | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private noteService: NoteService,
    private router: Router,
    private documentService: DocumentService
  ) { }

  ngOnInit() {
    this.initializeDragEnter();
    this.initializeDragLeave();
    this.initializeDragOver();
    this.initializeDrop();
  }

  ngOnDestroy() {
    this.removeDragEnterListener();
    this.removeDragLeaveListener();
    this.removeDragOverListener();
    this.removeDropListener();
  }

  private initializeDragEnter() {
    this.renderer.listen('window', 'dragenter', (e: DragEvent) => {
      if (this.isFile(e)) {
        this.lastTarget = e.target;
        this.showDropzone();
      }
    });
  }

  private initializeDragLeave() {
    this.renderer.listen('window', 'dragleave', (e: DragEvent) => {
      if (e.target === this.lastTarget) {
        this.hideDropzone();
      }
    });
  }

  private initializeDragOver() {
    this.renderer.listen('window', 'dragover', (e: DragEvent) => {
      e.preventDefault(); // Necessary to allow drop
    });
  }

  private initializeDrop() {
    this.renderer.listen('window', 'drop', (e: DragEvent) => {
      e.preventDefault();
      this.hideDropzone();

      // Logging each dropped file
      const dt = e.dataTransfer;
      if (dt) {
        const files = dt.files;
        for (let i = 0; i < files.length; i++) {
          this.uploadFileIfEditMode(files[i]);
        }
      }
    });
  }

  private isFile(evt: DragEvent): boolean {
    const dt = evt.dataTransfer;
    if (dt) {
      for (let i = 0; i < dt.types.length; i++) {
        if (dt.types[i] === 'Files') {
          return true;
        }
      }
    }
    return false;
  }

  private showDropzone() {
    this.renderer.setStyle(this.el.nativeElement.querySelector('#dropzone'), 'visibility', 'visible');
    this.renderer.setStyle(this.el.nativeElement.querySelector('#dropzone'), 'opacity', '1');
  }

  private hideDropzone() {
    this.renderer.setStyle(this.el.nativeElement.querySelector('#dropzone'), 'visibility', 'hidden');
    this.renderer.setStyle(this.el.nativeElement.querySelector('#dropzone'), 'opacity', '0');
  }

  private uploadFileIfEditMode(file: File) {
    if (this.router.url.includes('notes/edit/')) {
      const id = this.router.url.split('/')[4]
      this.noteService.uploadDocument(file, id);
    } else {
      this.documentService.uploadDocument(file);
    }
  }

  private removeDragEnterListener() {
    this.renderer.listen('window', 'dragenter', () => {
      /* Empty function to remove the listener */
    });
  }

  private removeDragLeaveListener() {
    this.renderer.listen('window', 'dragleave', () => {
      /* Empty function to remove the listener */
    });
  }

  private removeDragOverListener() {
    this.renderer.listen('window', 'dragover', () => {
      /* Empty function to remove the listener */
    });
  }

  private removeDropListener() {
    this.renderer.listen('window', 'drop', () => {
      /* Empty function to remove the listener */
    });
  }
}
