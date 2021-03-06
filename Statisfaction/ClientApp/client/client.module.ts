import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { ClientComponent } from './components/client/client.component';
import { CounterComponent } from './components/counter/counter.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { QuickstartComponent } from './components/quickstart/quickstart.component';
import { NavMenuComponent} from './components/navmenu/navmenu.component';
import { ChartComponent} from './components/chart/chart.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DateTimePickerModule } from 'ng2-date-time-picker';

import { EditorModule } from '../editor/editor.module';

import { ChartsModule } from 'ng2-charts';
import { DataHandlerService } from './components/chart/data-handler.service';
import { SelectSurveyComponent } from "./components/survey-selection/survey-selector.component";
import { EditorComponent } from "../editor/components/editor/editor.component";
import { CustomizeComponent } from "../editor/components/customize/customize.component";
import { FinalizeComponent } from "../editor/components/finalize/finalize.component";
import { GeneralComponent } from "../editor/components/general/general.component";
import { RegisterUnitViewComponent } from "./components/register-unit-view/register-unit-view.component";


import { SurveyOverviewComponent } from './components/overview/overview.component';
import { SurveySummaryComponent } from './components/survey-summary/survey-summary.component';
import { OverviewHelpComponent } from './components/overview-help/overview-help.component';
import { ChartContentComponent } from "./components/chart/chart-content/chart-content.component";
import { ChartDirective } from "./components/chart/chart.directive";

import { SurveyFilterPipe } from './components/overview/survey-filter.pipe'
import { ProductionStatePipe, DraftStatePipe } from './components/overview/state-filter.pipe'

const routes: Routes =
[
    { path: '', redirectTo: 'client', pathMatch: 'full' },
    { path: 'client', component:ClientComponent, children:
    [
        {path: 'quickstart', component: QuickstartComponent},
        {path: 'fetch-data', component: FetchDataComponent},
        {path: 'register-unit-view', component: RegisterUnitViewComponent},
        {path: 'chart', component: ChartComponent},
        {path: 'surveys', component: SurveyOverviewComponent},
        {path: 'editor', component: EditorComponent, children:
                [
                    { path: 'general', component: GeneralComponent },
                    { path: 'customize', component: CustomizeComponent },
                    { path: 'finalize', component: FinalizeComponent }
                ]
        },
        { path: 'survey-selector', component: SelectSurveyComponent }
    ]},
    { path: '**', redirectTo: 'client' }
]

@NgModule({
    bootstrap: [ClientComponent],
    declarations: [
        ClientComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        QuickstartComponent,   
        ChartComponent,     
        SurveyOverviewComponent,
        SurveySummaryComponent,
        OverviewHelpComponent,
        SelectSurveyComponent,  
        RegisterUnitViewComponent,
        ChartDirective,
        ChartContentComponent,     
        RegisterUnitViewComponent, 
        SurveyFilterPipe,
        ProductionStatePipe,
        DraftStatePipe
    ],
    imports: [  
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        ChartsModule,
        EditorModule,
        FormsModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        DateTimePickerModule
        
    ],
    providers: [
        DataHandlerService
    ],
    entryComponents: [ChartContentComponent]
})

export class ClientModule {

}
