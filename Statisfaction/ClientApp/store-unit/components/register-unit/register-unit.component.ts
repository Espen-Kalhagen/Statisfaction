import { Component, AfterViewInit } from '@angular/core';
import { RouterModule, Router } from "@angular/router";
import { Http, RequestOptions, Headers } from '@angular/http';
import { CookieService } from 'ng2-cookies';
import { Observable } from "rxjs/Rx";

@Component({
    selector: 'register-unit',
    providers: [CookieService],
    templateUrl: './register-unit.component.html',
    styleUrls: ["./register-unit.component.css"]
})

export class RegisterUnitComponent {
    //Dependency injection framework whoop whoop!
    public constructor(
        private router: Router,
        private http: Http,
        private cookie: CookieService
    ) {

    }
    public sendPin(pin: String) {

        let data = new RegistrationData(Number(pin));
        let body = JSON.stringify(data);
        let options = new RequestOptions();
        options.headers = new Headers({ 'Content-Type': 'application/json' });

        this.http.post('api/UnitSetup/register', body, options).catch(err => {
            alert("There was an error in the registration, please log out and in and restart the process");
            return Observable.throw(err); // observable needs to be returned or exception raised
        }).subscribe(res => this.handleActivation(res));

    }

    private handleActivation(response: any) {
        this.cookie.set('StoreUnitCookie', response._body);
        console.log('Check cookie' + ' returned ' + JSON.parse(this.cookie.get('StoreUnitCookie')).id);
        this.router.navigate(['/store-unit'],  { skipLocationChange: true });
    }
}


export class RegistrationData {

    constructor(
        public pin: number
    ) { }
}