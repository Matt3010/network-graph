import {StatisticsComponent} from "../components/statistics/statistics.component";
import {NotifyComponent} from "../components/notify/notify.component";
import {NotesComponent} from "./notes/notes.component";
import {CommonModule} from "@angular/common";
import {PagesRoutingModule} from "./pages-routing.module";
import {NavbarComponent} from "../components/navbar/navbar.component";
import {NgModule} from "@angular/core";
import {EditorModule} from "primeng/editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GobackComponent} from "../components/goback/goback.component";
import {ToastrModule} from "ngx-toastr";
import {CreateBlankEntityComponent} from "../components/create-blank-entity/create-blank-entity.component";
import {EditComponent} from "./notes/edit/edit/edit.component";
import {LogoComponent} from "../components/logo/logo.component";
import {PagesComponent} from "./pages.component";
import {UserDropdownComponent} from "../components/user-dropdown/user-dropdown.component";
import {NotesPreviewComponent} from "../components/previews/notes-preview/notes-preview.component";
import {SortPipe} from "../pipes/sort.pipe";
import { ManagerComponent } from './manager/manager.component';
import { DirComponent } from './manager/dir/dir.component';
import { FileComponent } from './manager/file/file.component';
import {SearchbarComponent} from "../components/filters/searchbar/searchbar.component";


@NgModule({
  declarations: [
    PagesComponent,
    NotesComponent,
    NavbarComponent,
    UserDropdownComponent,
    LogoComponent,
    EditComponent,
    StatisticsComponent,
    NotifyComponent,
    GobackComponent,
    CreateBlankEntityComponent,
    NotesPreviewComponent,
    SortPipe,
    ManagerComponent,
    DirComponent,
    FileComponent,
    SearchbarComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ToastrModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
  ]
})
export class PagesModule {
}
