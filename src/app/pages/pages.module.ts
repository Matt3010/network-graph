import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import {FormsModule} from "@angular/forms";
import { RegistrationComponent } from './registration/registration.component';
import {ToastrModule} from "ngx-toastr";
import {NetworkComponent} from "../components/network/network.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    PagesComponent,
    RegistrationComponent,
    NetworkComponent,
    DashboardComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ToastrModule
  ]
})
export class PagesModule { }
