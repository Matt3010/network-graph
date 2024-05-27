import {Component, Input} from '@angular/core';
import {CloudElement, ManagerService} from "../../../../services/manager.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dir',
  templateUrl: './dir.component.html',
  styleUrls: ['./dir.component.scss']
})
export class DirComponent {

  @Input() dir!: CloudElement

  constructor(
    private router: Router,
    private managerService: ManagerService
  ) {
  }

  navigate(url_to_go: any) {
    this.router.navigate(['pages/cloud'], {queryParams: {'d': url_to_go}});
    this.managerService.navigate(url_to_go);
  }

  getFolderName() {
      const pathParts = this.dir.path.split('/');
      return pathParts[pathParts.length - 1];
  }


}
