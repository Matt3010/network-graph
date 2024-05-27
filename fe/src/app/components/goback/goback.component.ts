import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-goback',
  templateUrl: './goback.component.html',
  styleUrls: ['./goback.component.scss']
})
export class GobackComponent {

  window=window

  constructor(public location: Location) {
  }


}
