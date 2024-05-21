import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {AppComponent} from "./app.component";
import {RegistrationComponent} from "./pages/registration/registration.component";
import {AuthGuard} from "../services/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: 'pages/notes'
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AppComponent,
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
      {
        path: 'register',
        component: RegistrationComponent
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
