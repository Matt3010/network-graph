import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import {NetworkComponent} from "../../pages/network/network.component";
import {FormsModule} from "@angular/forms";
import { RegistrationComponent } from './registration/registration.component';


@NgModule({
  declarations: [
    PagesComponent,
    NetworkComponent,
    RegistrationComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule
  ]
})
export class PagesModule { }
