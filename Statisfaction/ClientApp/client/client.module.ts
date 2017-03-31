import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { ClientComponent } from './components/client/client.component';
import { CounterComponent } from './components/counter/counter.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { AnalyticsComponent } from "./components/analytics/analytics.component";


const routes: Routes =
[
    { path: '', redirectTo: 'client', pathMatch: 'full' },
    { path: 'client', component:ClientComponent, children:
    [
        {path: 'statistics', component: StatisticsComponent},
        {path: 'fetch-data', component: FetchDataComponent},
        {path: 'counter', component: CounterComponent},
        {path: 'analytics', component: AnalyticsComponent }
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
        AnalyticsComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forChild(routes),
        RouterModule.forRoot(routes)
    ]
})
export class ClientModule {

}
