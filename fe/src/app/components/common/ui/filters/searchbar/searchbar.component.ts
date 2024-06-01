import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {NoteService} from "../../../../../../services/note.service";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  query: FormControl = new FormControl('');
  shouldShowDelete: boolean = false;
  @Output() emitQuery = new EventEmitter<string>()

  constructor(
    public noteService: NoteService
  ) {
  }

  ngOnInit() {
    const last = localStorage.getItem('network-last-query-search');
    if (last) {
      this.query.setValue(last)
      this.shouldShowDelete = true;
    } else {
      this.query.setValue('')
      this.shouldShowDelete = false;
    }

    this.query.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe((res: string) => {
        localStorage.setItem('network-last-query-search', res)
        this.shouldShowDelete = true;
        this.emit(res);
        if (res.length === 0) {
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
