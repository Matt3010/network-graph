import {StatisticsComponent} from "../components/common/utils/statistics/statistics.component";
import {NotifyComponent} from "../components/common/utils/notify/notify.component";
import {NotesComponent} from "./notes/notes.component";
import {CommonModule} from "@angular/common";
import {PagesRoutingModule} from "./pages-routing.module";
import {NgModule} from "@angular/core";
import {EditorModule} from "primeng/editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GobackComponent} from "../components/common/utils/goback/goback.component";
import {ToastrModule} from "ngx-toastr";
import {PagesComponent} from "./pages.component";
import {UserDropdownComponent} from "../components/user-dropdown/user-dropdown.component";
import {SortPipe} from "../../pipes/sort.pipe";
import {ManagerComponent} from './manager/manager.component';
import {DirComponent} from './manager/dir/dir.component';
import {FileComponent} from './manager/file/file.component';
import {SearchbarComponent} from "../components/common/utils/filters/searchbar/searchbar.component";
import {SidebarComponent} from "../components/sidebar/sidebar.component";
import {HeaderComponent} from "../components/sidebar/header/header.component";
import {DividerComponent} from "../components/common/utils/divider/divider.component";
import {MenuComponent} from "../components/sidebar/menu/menu.component";
import {SimpleTitleComponent} from "../components/common/utils/titles/simple-title/simple-title.component";
import {TooltipModule} from "primeng/tooltip";
import { TableModule } from 'primeng/table';
import {
  NotesPreviewLayout1Component
} from "../components/previews/notes/notes-preview-layout-1/notes-preview-layout-1.component";
import {EditComponent} from "./notes-edit/edit.component";
import { DropzoneComponent } from './dropzone/dropzone.component';
import {DateAgoPipe} from "../../pipes/date-ago.pipe";
import {UploadingProgressComponent} from "../components/previews/uploading-progress/uploading-progress.component";


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
    DateAgoPipe,
    ManagerComponent,
    DirComponent,
    FileComponent,
    SearchbarComponent,
    SidebarComponent,
    HeaderComponent,
    DividerComponent,
    MenuComponent,
    SimpleTitleComponent,
    NotesPreviewLayout1Component,
    DropzoneComponent,
    UploadingProgressComponent
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
    TableModule,
  ]
})
export class PagesModule {
}
