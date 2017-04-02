import { Component } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { RouterModule, Router } from "@angular/router";
import { Http, RequestOptions, Headers } from '@angular/http';

@Component({
    selector: 'store-unit',
    providers: [CookieService],
    templateUrl: './store-unit.component.html',
    styleUrls: ["./store-unit.component.css"]
})

export class StoreUnitComponent 
{

    public constructor(
        private router: Router,
        private http: Http,
        private cookie: CookieService
    ) {
    }
    ngAfterViewInit() {

        if(!this.cookie.check('StoreUnitCookie')){
            this.router.navigate(['/register-unit'])
            return;
        }
        let data = new RegistrationCheckData(
         JSON.parse(this.cookie.get('StoreUnitCookie')).id,
         JSON.parse(this.cookie.get('StoreUnitCookie')).ownerID
        )
        let body = JSON.stringify(data);
        let options = new RequestOptions();
        options.headers = new Headers({ 'Content-Type': 'application/json' });
        let error=null;
        this.http.post('api/UnitSetup/checkRegistration', body, options).subscribe(res => this.handleCheck(res));
        alert("Please register the store unit first");
        


        
    }
    private handleCheck(response: any) {
        console.log(response._body);

        console.log('activation check returned ' + JSON.parse(response._body).confirmed);
        if (JSON.parse(response._body).exists){
            this.router.navigate(['/register-unit'])
        }else{
            this.router.navigate([''])
        }
        
    }
    
}
export class RegistrationCheckData {

    constructor(
        public Unitid: number,
        public ownerID:string
    ) { }
}