import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { ClientComponent } from './components/client/client.component';
import { CounterComponent } from './components/counter/counter.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
<<<<<<< HEAD
import { NavMenuComponent} from './components/navmenu/navmenu.component';
import { ChartComponent} from './components/chart/chart.component';
import { ChartsModule } from 'ng2-charts';
import { DataHandlerService } from './components/chart/data-handler.service';

const routes: Routes =
[
    { path: '', redirectTo: 'client', pathMatch: 'full' },
    { path: 'client', component:ClientComponent, children:
    [
        {path: 'statistics', component: StatisticsComponent},
        {path: 'fetch-data', component: FetchDataComponent},
        {path: 'counter', component: CounterComponent},
        {path: 'chart', component: ChartComponent}
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
        StatisticsComponent,       
        ChartComponent,
    ],
    imports: [  
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        ChartsModule,
        RouterModule.forChild(routes),
        RouterModule.forRoot(routes)
    ],
    providers: [
        DataHandlerService
    ]
})
export class ClientModule {

}
