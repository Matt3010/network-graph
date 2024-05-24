import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {NoteService} from "../../../../services/note.service";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {

  query: FormControl = new FormControl('');
  shouldShowDelete: boolean = false;
  @Output() emitQuery = new EventEmitter<string>()

  constructor(
    private noteService: NoteService,
  ) {

    const lastQuery = localStorage.getItem('network-last-query-search')
    if(lastQuery) {
      this.query.setValue(lastQuery!)
      this.shouldShowDelete = true;
    }

    this.query.valueChanges.subscribe((res: string) => {
      this.shouldShowDelete = true;
      this.emit(res);
      if(res.length === 0) {
        this.shouldShowDelete = false;
      }
    })
  }

  emit(to_emit: string) {
    this.emitQuery.emit(to_emit);
  }

  resetDeleteState() {
    this.query.setValue('');
    this.emit('');
    this.shouldShowDelete = false;
  }

}
