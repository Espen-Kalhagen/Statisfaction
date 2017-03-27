import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversalModule } from 'angular2-universal';

import { StoreUnitModule } from '../store-unit/store-unit.module';
import {ClientModule} from '../client/client.module'

import { AppComponent } from './components/app/app.component';

const routes: Routes =
[
    { path: '', redirectTo: 'statistics', pathMatch: 'full' },
    { path: '**', redirectTo: 'Statistics' },
    {path: 'store-unit', component: StoreUnitModule},
    {path: 'statistics', component : ClientModule}
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
    ]
})
export class AppModule {
}
