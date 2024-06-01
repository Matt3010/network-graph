import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from './pages.component';
import {NotesComponent} from "./notes/notes.component";
import {ManagerComponent} from "./manager/manager.component";
import {EditComponent} from "./notes-edit/edit.component";

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        pathMatch: "full",
        redirectTo: 'home'
      },
      {
        path: 'cloud',
        component: ManagerComponent
      },
      {
        path: 'notes',
        children: [
          {
            path: '',
            component: NotesComponent
          },
          {
            path: 'edit/:id',
            component: EditComponent
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
