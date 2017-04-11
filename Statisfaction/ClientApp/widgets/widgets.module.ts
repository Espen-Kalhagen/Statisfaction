import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { SmileyWidgetComponent } from './components/smiley-widget/smiley-widget.component';


@NgModule({
    declarations: [
        SmileyWidgetComponent
    ],
    imports: [
        UniversalModule // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
    ],
    exports: [
        SmileyWidgetComponent,
    ]
})

export class WidgetModule
{
    
}
