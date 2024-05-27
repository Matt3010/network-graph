import {ActivatedRoute, Router} from "@angular/router";
import {ManagerService} from "../../../services/manager.service";
import {Component} from "@angular/core";

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent {

  manager$ = this.managerService.manager$;
  currentLocation: any;

  constructor(
    private managerService: ManagerService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {
    this.load();
  }

  load() {
    this.activateRoute.queryParamMap.subscribe(params => {
      this.currentLocation = params.get('d');
      if (this.currentLocation) {
        this.managerService.navigate(this.currentLocation);
      } else {
        this.managerService.navigate('');
      }
    });
  }


  goBack() {
    this.currentLocation = this.activateRoute.snapshot.queryParamMap.get('d');
    if (this.currentLocation) {
      const result = this.currentLocation.split('/');
      console.log(result);
      if (result.length === 1) {
        this.router.navigate(['pages/cloud']);
        this.managerService.navigate('');
      } else {
        const currentLocation = result.slice(0, -1).join('/');
        this.router.navigate(['pages/cloud'], {queryParams: {'d': currentLocation}});
        this.managerService.navigate(currentLocation);
      }
    }
  }

}
