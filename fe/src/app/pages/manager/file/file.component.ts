import {Component, Input} from '@angular/core';
import {CloudElement} from "../../../../services/manager.service";

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent {
  @Input() file!: CloudElement

  getFileName() {
    const pathParts = this.file.path.split('/');
    return pathParts[pathParts.length - 1];
  }



}
