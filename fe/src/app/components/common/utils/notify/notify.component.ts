import {Component, Input} from '@angular/core';
import {SlideInOutAnimation} from "../../../../../services/utils/animations";

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
  animations: [SlideInOutAnimation]
})
export class NotifyComponent {
  @Input() toNotify: string = 'Choose a text'
}
