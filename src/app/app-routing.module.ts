import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: 'pages/network'
  },
  {path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  {
    path: 'auth',
    children: [
      {
        path: '',
        pathMatch: "full",
        redirectTo: 'login'
      },
      {
        path: 'login',
        component: LoginComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
