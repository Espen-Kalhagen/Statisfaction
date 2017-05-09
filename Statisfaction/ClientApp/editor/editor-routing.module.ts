import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditorComponent } from './components/editor/editor.component';
import { GeneralComponent } from './components/general/general.component';
import { FinalizeComponent } from './components/finalize/finalize.component';
import { SurveyOverviewComponent } from './components/overview/overview.component';

import { CustomizeComponent } from './components/customize/customize.component';

const routes: Routes =
  [
    { path: 'surveys', component: SurveyOverviewComponent, children:
      [
        { path: 'editor', component: EditorComponent, children:
          [
            { path: 'general', component: GeneralComponent },
            { path: 'customize', component: CustomizeComponent },
            { path: 'finalize', component: FinalizeComponent }
          ]
        }
      ]
    }
  ];

@NgModule({
  imports:
  [
    RouterModule.forChild(routes),

  ],
  exports:
  [
    RouterModule
  ]
})

export class EditorRoutingModule { }