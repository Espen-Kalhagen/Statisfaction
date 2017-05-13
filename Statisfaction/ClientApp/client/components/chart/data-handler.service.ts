import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataHandlerService {

    constructor(private http: Http) { }

    getData(): Promise<number[]> {
        return this.http.get('/api/statistics').toPromise().then(result => {
            let array:number[] = [];
            for (let value of result.json()) {
                array.push(value.count);
            }
            return array;
        });
    }
}

function random(min:number, max:number):number
{
    return Math.floor(Math.random() * max) + min;
}