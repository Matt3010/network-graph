import {Component, Input, OnInit} from '@angular/core';
import {Dropdown} from "../../../../../@data/dropdown";


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  @Input() config!: Dropdown[];
  disabled: boolean = false;
  tooltipTextKey: string | null = null;
  hasDeleteItem: boolean = false;
  itemHasMarginBottom?: string;
  @Input () showDotsBtn?: boolean = true;
  @Input() isDotsBtnLightBg: boolean = true;

  ngOnInit() {
    this.initConfig();
  }

  initConfig() {
    this.config?.forEach((itemDropdown) => {
     });
  }

  doAction(item: any) {
    return item.disabled ? null : item.action();
  }
}
