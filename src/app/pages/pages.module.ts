import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import {NetworkComponent} from "../../pages/network/network.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    PagesComponent,
    NetworkComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule
  ]
})
export class PagesModule { }
