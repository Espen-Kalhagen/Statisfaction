import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { EditorComponent } from './components/editor/editor.component';
import { GeneralComponent } from './components/general/general.component';
import { FinalizeComponent } from './components/finalize/finalize.component';
import { CustomizeComponent } from './components/customize/customize.component';

import { FinalizeSidebarComponent } from './components/finalize-sidebar/finalize-sidebar.component';
import { CustomizeSidebarComponent } from './components/customize-sidebar/customize-sidebar.component';
import { GeneralSidebarComponent } from './components/general-sidebar/general-sidebar.component';
import { EditorTopbarComponent } from './components/editor-topbar/editor-topbar.component';

import { WidgetSmileyEditor } from './components/widget-smiley/widget-smiley.component';
import { WidgetQuestionEditorComponent } from './components/widget-question/widget-question.component';

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
        CustomizeSidebarComponent,
        GeneralSidebarComponent,
        FinalizeSidebarComponent,
        WidgetQuestionEditorComponent,
        EditorTopbarComponent
    ],
    imports: [
        UniversalModule,
        RouterModule,
        EditorRoutingModule,
        WidgetModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        EditorComponent
        
    ],


})

export class EditorModule
{
    
}
