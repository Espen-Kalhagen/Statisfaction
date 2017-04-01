import { Component } from '@angular/core';
import { RouterModule, Router } from "@angular/router";
import { Http, RequestOptions, Headers } from '@angular/http';

@Component({
    selector: 'register-unit',
    templateUrl: './register-unit.component.html',
    styleUrls: ["./register-unit.component.css"]
})

export class RegisterUnitComponent 
{
    //Dependency injection framework whoop whoop!
    public constructor(
        private router: Router,
        private http: Http
        ){

    }
    public sendPin(pin :String) {

        let data = new RegistrationData(Number(pin));
        let body = JSON.stringify(data); 
        let options = new RequestOptions();
        options.headers = new Headers({ 'Content-Type': 'application/json' });
       
        this.http.post('api/UnitSetup', body, options).subscribe(res => this.handleActivation(res) );
    }

    private handleActivation(responce :any ){
        
        this.router.navigate(['/store-unit'])
    }
        
    
}

export class RegistrationData {

    constructor(
        public pin: number
    ) { }
}