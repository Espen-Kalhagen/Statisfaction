import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html'
})
export class FetchDataComponent {
    public Reponses: CustomerResponces[];

    constructor(http: Http) {
        http.get('/api/SampleData/CustomerResponses').subscribe(result => {
            this.Reponses = result.json() as CustomerResponces[];
        });
    }
}

interface CustomerResponces {
    id: string;
    content: string;
}
