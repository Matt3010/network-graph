import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit{

  shouldShowToolbox: boolean = false;
  @Output() emitQuery = new EventEmitter<string>();

  queryFormControl: FormControl = new FormControl(null);

  ngOnInit() {
    this.queryFormControl.setValue(this.getLastFilter());
    this.queryFormControl.valueChanges
      .subscribe((res: string) => {
        this.emit(res);
    })
  }

  getLastFilter() {
    return localStorage.getItem('network-query-filter')!;
  }

  emit(key: string) {
    localStorage.setItem('network-query-filter', key)
    this.emitQuery.emit(key);
  }
}
