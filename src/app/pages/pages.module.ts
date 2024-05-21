import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule} from "ngx-toastr";
import {NavbarComponent} from "../components/navbar/navbar.component";
import {UserDropdownComponent} from "../components/user-dropdown/user-dropdown.component";
import {LogoComponent} from "../components/logo/logo.component";
import {NotesComponent} from "./notes/notes.component";
import {EditComponent} from './notes/edit/edit/edit.component';
import { EditorModule } from 'primeng/editor';

@NgModule({
  declarations: [
    PagesComponent,
    NotesComponent,
    NavbarComponent,
    UserDropdownComponent,
    LogoComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ToastrModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule
  ]
})
export class PagesModule {
}
