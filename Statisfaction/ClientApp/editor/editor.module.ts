import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { FormsModule }   from '@angular/forms';


import { EditorComponent } from './components/editor/editor.component';
import { GeneralComponent } from './components/general/general.component';
import { FinalizeComponent } from './components/finalize/finalize.component';
import { CustomizeComponent } from './components/customize/customize.component';
import { SurveyOverviewComponent } from './components/overview/overview.component';

import { WidgetSmileyEditor } from './components/widget-smiley/widget-smiley.component';


// Costom modules
import { WidgetModule} from '../widgets/widgets.module';
import { EditorRoutingModule } from './editor-routing.module'

@NgModule({
    declarations: [
        EditorComponent,
        GeneralComponent,
        CustomizeComponent,
        FinalizeComponent,
        WidgetSmileyEditor,
        SurveyOverviewComponent
    ],
    imports: [
        UniversalModule,
        RouterModule,
        EditorRoutingModule,
        WidgetModule,
        FormsModule
    ],
    exports: [
        EditorComponent
    ]

})

export class EditorModule
{
    
}
