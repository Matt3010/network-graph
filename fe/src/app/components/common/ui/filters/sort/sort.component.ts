import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent {

  @Output() emitSorting = new EventEmitter<string>();
  sort: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.sort = <'asc' | 'desc'>this.getLastSort();
  }

  getLastSort(): string {
    return localStorage.getItem('network-sort-filter')!;
  }

  emit() {
    localStorage.setItem('network-sort-filter', this.sort)
    this.emitSorting.emit(this.sort);
  }
}
