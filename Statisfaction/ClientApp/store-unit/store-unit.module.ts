// Angular modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { UniversalModule } from 'angular2-universal';

// Costom modules
import { WidgetModule} from '../widgets/widgets.module';

// Components
import { StoreUnitComponent } from './components/store-unit/store-unit.component';
import { RegisterUnitComponent } from "./components/register-unit/register-unit.component";
import { SmileyWidgetComponent } from "../widgets/components/smiley-widget/smiley-widget.component";
import { WidgetDirective } from "./components/store-unit/store-unit.directive";
import { QuestionWidgetComponent } from "../widgets/components/question-widget/question-widget.component";
import { CookieService } from "ng2-cookies";
import { SendingService } from "./SendingService";
import { ThanksWidgetComponent } from "../widgets/components/thanks-widget/thanks-widget.component";




const routes: Routes =
[
    {path: 'store-unit', component: StoreUnitComponent},
    {path: 'register-unit', component: RegisterUnitComponent }

]

@NgModule({
    declarations: [
        StoreUnitComponent,
        RegisterUnitComponent,
        WidgetDirective
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot(routes),
        WidgetModule,
        
    ],
    entryComponents: [ SmileyWidgetComponent, QuestionWidgetComponent, ThanksWidgetComponent ],
     providers: [CookieService, SendingService],
})

export class StoreUnitModule
{

    // Load the survey-configurations from the server

    // Configure the routing -> Step1 -> Step2 -> etc...

    // Create callbacks from user-interactions!

}
