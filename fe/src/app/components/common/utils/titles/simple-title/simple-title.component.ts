import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-simple-title',
  templateUrl: './simple-title.component.html',
  styleUrls: ['./simple-title.component.scss']
})
export class SimpleTitleComponent {

  @Input() pageTitle: string = 'No title provided!'

}
