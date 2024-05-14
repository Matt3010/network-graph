import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import {NetworkComponent} from "../components/network/network.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {HomeComponent} from "../components/home/home.component";
import {GettingStartedComponent} from "../components/getting-started/getting-started.component";

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        pathMatch: "full",
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          {
            path: 'home',
            component: HomeComponent
          },
          {
            path: 'getting-started',
            component: GettingStartedComponent
          },
          {
            path: 'network',
            component: NetworkComponent
          },
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
