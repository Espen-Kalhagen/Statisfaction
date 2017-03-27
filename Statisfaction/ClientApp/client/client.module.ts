import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { ClientComponent } from './components/client/client.component';
import { CounterComponent } from './components/counter/counter.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { NavMenuComponent} from './components/navmenu/navmenu.component';


const routes: Routes =
    [
        { path: '', redirectTo: 'statistics', pathMatch: 'full' },
        { path: 'statistics', component: StatisticsComponent },
        { path: 'counter', component: CounterComponent },
        { path: 'fetch-data', component: FetchDataComponent },
        { path: 'client', component: ClientComponent},
        { path: '**', redirectTo: 'Statistics' }
    ]

@NgModule({
    declarations: [
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        StatisticsComponent,
        ClientComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forChild(routes),
    ]
})
export class ClientModule {

}
