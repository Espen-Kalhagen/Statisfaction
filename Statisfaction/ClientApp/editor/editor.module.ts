import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { UniversalModule } from 'angular2-universal';

import { EditorComponent } from './components/editor/editor.component';
import { GeneralComponent } from './components/general/general.component';
import { WidgetCustomizer } from './components/widget-customizer/widget-customizer.component';

import { EditorRoutingModule } from './editor-routing.module'

@NgModule({
    declarations: [
        EditorComponent,
        GeneralComponent,
        WidgetCustomizer
    ],
    imports: [
        UniversalModule,
        RouterModule,
        EditorRoutingModule
    ],
    exports: [
        EditorComponent
    ]

})

export class EditorModule
{
    
}
