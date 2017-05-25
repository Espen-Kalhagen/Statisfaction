import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { AuthRegisterComponent } from './components/auth-register/auth-register.component';

const routes: Routes =
    [
        { path: 'auth', component: AuthRegisterComponent }
    ]

@NgModule({
    declarations: [
        AuthRegisterComponent,
    ],
    imports: [
        UniversalModule,
        FormsModule,
        ReactiveFormsModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot(routes),
    ]
})

export class AuthModule {

}
