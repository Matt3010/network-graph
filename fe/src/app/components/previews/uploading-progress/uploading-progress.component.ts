import { Component } from '@angular/core';
import {UploadingProgressService} from "../../../../services/utils/uploading-progress.service";
import {map} from "rxjs";

@Component({
  selector: 'app-uploading-progress',
  templateUrl: './uploading-progress.component.html',
  styleUrls: ['./uploading-progress.component.scss']
})
export class UploadingProgressComponent {

  shouldBeExpanded: boolean = false;
  filesUploaded$ = this.progressService.files$;


  constructor(
    private progressService: UploadingProgressService
  ) {
  }

  getFilesUploading() {
    return this.filesUploaded$
      .pipe(
        map(res => res.filter(i => i.status === 'uploading').length)
      );
  }

  getFilesUploaded() {
    return this.filesUploaded$
      .pipe(
        map(res => res.filter(i => i.status === 'uploaded').length)
      );
  }


}
