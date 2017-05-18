import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversalModule } from 'angular2-universal';

import { StoreUnitModule } from '../store-unit/store-unit.module';
import { ClientModule } from '../client/client.module'

import { AppComponent } from './components/app/app.component';
import { StatisticsComponent } from '../client/components/statistics/statistics.component';

import { EditorSharedDataService } from '../editor/editor-shared-data.service';

const routes: Routes =
    [
        { path: '', redirectTo: 'console', pathMatch: 'full' },
        { path: '**', redirectTo: 'console' },
        { path: 'store-unit', component: StoreUnitModule },
        { path: 'console', component: ClientModule }
    ]

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot(routes),
        StoreUnitModule,
        ClientModule
    ],
    providers: [EditorSharedDataService]
})
export class AppModule {
}
