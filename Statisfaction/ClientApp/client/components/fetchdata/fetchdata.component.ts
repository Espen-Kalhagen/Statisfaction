import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html',
    styleUrls: ['./fetchdata.component.css']
})
export class FetchDataComponent {
    public responses : string;

    constructor(http: Http) {
        http.get('/api/SampleData/CustomerResponses').subscribe(result => {
            this.responses = result.json() as string;
        });

    }
}