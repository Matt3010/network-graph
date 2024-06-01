import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
 })
export class NotifyComponent {
  @Input() toNotify: string = 'Choose a text'
}
