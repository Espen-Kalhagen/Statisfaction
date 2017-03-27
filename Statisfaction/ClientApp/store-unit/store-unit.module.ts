import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { StoreUnitComponent} from './components/store-unit/store-unit.component';


const routes: Routes =
[
    {path: 'store-unit', component: StoreUnitComponent}
]


@NgModule({
    declarations: [
        StoreUnitComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forChild(routes),
    ]
})
export class StoreUnitModule
{
    
}
