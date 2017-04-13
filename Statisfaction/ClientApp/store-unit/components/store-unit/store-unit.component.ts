import { Component } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { RouterModule, Router } from "@angular/router";
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";
import { SendingService } from "../../SendingService";

import { WSmileyModel } from '../../../models/models';

@Component({
    selector: 'store-unit',
    providers: [CookieService, SendingService],
    templateUrl: './store-unit.component.html',
    styleUrls: ["./store-unit.component.css"]
})

export class StoreUnitComponent 
{

    CookieContet: string;

    model:WSmileyModel = new WSmileyModel();

    public constructor(
        private router: Router,
        private http: Http,
        private cookie: CookieService,
        private sendingService: SendingService
    ) {
        sendingService.init();
    }
    ngAfterViewInit() {

        if(!this.cookie.check('StoreUnitCookie')){
            this.router.navigate(['/register-unit'], { skipLocationChange: true })
            return;
        }
        console.log("FOUND COOKIE: " + this.cookie.get('StoreUnitCookie'));
        this.CookieContet = this.cookie.get('StoreUnitCookie');
        let CookieObject = JSON.parse(this.CookieContet);
        let data = new RegistrationCheckData(
            CookieObject.id,
            CookieObject.ownerID
        )
        let body = JSON.stringify(data);
        let options = new RequestOptions();
        options.headers = new Headers({ 'Content-Type': 'application/json' });
        this.http.post('api/UnitSetup/checkRegistration', body, options).catch(err => {
            alert("There was an error in the registration, please log out and in and restart the process");
            this.router.navigate(['/register-unit'], { skipLocationChange: true });
            this.cookie.delete('StoreUnitCookie');
            return Observable.throw(err); // observable needs to be returned or exception raised
        }).subscribe(res => this.handleCheck(res));
        


        
    }
    private handleCheck(response: any) {
        console.log(response._body);

        console.log('activation check returned ' + JSON.parse(response._body).confirmed);
        if (!JSON.parse(response._body).confirmed){
            this.router.navigate(['/register-unit'], { skipLocationChange: true })
        }
        
    }
    
}
export class RegistrationCheckData {

    constructor(
        public Unitid: number,
        public ownerID:string
    ) { }
}