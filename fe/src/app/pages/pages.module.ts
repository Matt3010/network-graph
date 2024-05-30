import {StatisticsComponent} from "../components/statistics/statistics.component";
import {NotifyComponent} from "../components/notify/notify.component";
import {NotesComponent} from "./notes/notes.component";
import {CommonModule} from "@angular/common";
import {PagesRoutingModule} from "./pages-routing.module";
import {NgModule} from "@angular/core";
import {EditorModule} from "primeng/editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GobackComponent} from "../components/goback/goback.component";
import {ToastrModule} from "ngx-toastr";
import {PagesComponent} from "./pages.component";
import {UserDropdownComponent} from "../components/user-dropdown/user-dropdown.component";
import {SortPipe} from "../pipes/sort.pipe";
import {ManagerComponent} from './manager/manager.component';
import {DirComponent} from './manager/dir/dir.component';
import {FileComponent} from './manager/file/file.component';
import {SearchbarComponent} from "../components/filters/searchbar/searchbar.component";
import {EditComponent} from "./notes/edit/edit/edit.component";
import {SidebarComponent} from "../components/sidebar/sidebar.component";
import {HeaderComponent} from "../components/sidebar/header/header.component";
import {DividerComponent} from "../components/divider/divider.component";
import {MenuComponent} from "../components/sidebar/menu/menu.component";
import {SimpleTitleComponent} from "../components/titles/simple-title/simple-title.component";
import {NotesLayout1Component} from "../components/previews/notes/notes-layout-1/notes-layout-1.component";
import {TooltipModule} from "primeng/tooltip";
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    PagesComponent,
    NotesComponent,
    UserDropdownComponent,
    EditComponent,
    StatisticsComponent,
    NotifyComponent,
    GobackComponent,
    SortPipe,
    ManagerComponent,
    DirComponent,
    FileComponent,
    SearchbarComponent,
    SidebarComponent,
    HeaderComponent,
    DividerComponent,
    MenuComponent,
    SimpleTitleComponent,
    NotesLayout1Component,

  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ToastrModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    TooltipModule,
    TableModule
  ]
})
export class PagesModule {
}
