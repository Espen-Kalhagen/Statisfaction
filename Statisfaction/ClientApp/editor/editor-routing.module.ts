import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { EditorComponent } from './components/editor/editor.component';
import { GeneralComponent } from './components/general/general.component';
import { WidgetCustomizer } from './components/widget-customizer/widget-customizer.component';

const routes: Routes = 
[
    {path: 'editor', component: EditorComponent, children:
    [
      {path: 'general', component: GeneralComponent},
      {path: 'customizer', component: WidgetCustomizer},
    ]}
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