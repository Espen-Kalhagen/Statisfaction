// Angular modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { UniversalModule } from 'angular2-universal';

// Costom modules
import { WidgetModule} from '../widgets/widgets.module';

// Components
import { StoreUnitComponent } from './components/store-unit/store-unit.component';




const routes: Routes =
[
    {path: 'store-unit', component: StoreUnitComponent}
]

@NgModule({
    declarations: [
        StoreUnitComponent,
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot(routes),
        WidgetModule,
    ]
})

export class StoreUnitModule
{

    // Load the survey-configurations from the server

    // Configure the routing -> Step1 -> Step2 -> etc...

    // Create callbacks from user-interactions!

}
