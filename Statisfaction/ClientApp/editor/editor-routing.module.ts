import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { EditorComponent } from './components/editor/editor.component';
import { GeneralComponent } from './components/general/general.component';

const routes: Routes = 
[
    {path: 'client/editor', component: EditorComponent},
    {path: 'general', component: GeneralComponent}
];

@NgModule({
  imports: 
  [
    RouterModule.forChild(routes)
  ],
  exports: 
  [
    RouterModule
  ]
})

export class EditorRoutingModule {}