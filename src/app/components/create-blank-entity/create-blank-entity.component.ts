import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-create-blank-entity',
  templateUrl: './create-blank-entity.component.html',
  styleUrls: ['./create-blank-entity.component.scss']
})
export class CreateBlankEntityComponent {

  @Input() asset_img: string = '';
  @Input() entity: string = 'New entity';


}
