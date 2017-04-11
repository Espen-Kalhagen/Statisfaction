import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { SmileyWidgetComponent } from './components/smiley-widget/smiley-widget.component';
import { QuestionWidgetComponent } from "./components/question-widget/question-widget.component";



@NgModule({
    declarations: [
        SmileyWidgetComponent,
        QuestionWidgetComponent
    ],
    imports: [
        UniversalModule // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
    ],
    exports: [
        SmileyWidgetComponent,
        QuestionWidgetComponent

    ]
})

export class WidgetModule
{
    
}
