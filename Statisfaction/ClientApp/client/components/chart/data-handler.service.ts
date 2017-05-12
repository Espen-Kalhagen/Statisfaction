import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class DataHandlerService {

    constructor(private http: Http) { }

    getData(): Promise<number[]> {
        let array:number[] = [];
        this.http.get('/api/statistics').subscribe(result => {
            for (let value of result.json()) {
                array.push(value.count);
            }
        });
        return Promise.resolve(array);
    }
}

function random(min:number, max:number):number
{
    return Math.floor(Math.random() * max) + min;
}