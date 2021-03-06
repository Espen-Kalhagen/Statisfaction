import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversalModule } from 'angular2-universal';

import { StoreUnitModule } from '../store-unit/store-unit.module';
import { ClientModule } from '../client/client.module'
import { AuthModule } from '../auth/auth.module';

import { AppComponent } from './components/app/app.component';
import { QuickstartComponent } from '../client/components/quickstart/quickstart.component';

import { EditorSharedDataService } from '../editor/editor-shared-data.service';

const routes: Routes =
    [
        { path: '', redirectTo: 'console', pathMatch: 'full' },
        { path: '**', redirectTo: 'console' },
        { path: 'store-unit', component: StoreUnitModule },
        { path: 'console', component: ClientModule },
        { path: 'auth', component: AuthModule }
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
        AuthModule,
        ClientModule,
    ],
    providers: [EditorSharedDataService]
})
export class AppModule {
}
