import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
declare var OwnerID: any;

@Injectable()
export class DataHandlerService {

    constructor(private http: Http) { }

    getData(): Promise<number[]> {
        return this.http.get('/api/statistics/satisfaction').toPromise().then(result => {
            let array:number[] = [];
            for (let value of result.json()) {
                array.push(value.count);
            }
            return array;
        });
    }


getStatisticsResponces(date:string, unitID:string): Promise<any>{
    console.log('http://localhost:5000/api/statistics/unit/'+unitID+'?date=' +date);

    return this.http.get('http://localhost:5000/api/statistics/unit/'+unitID+'?date=' +date).toPromise().then(result => {
            let response = result.json() as string;
            console.log(result.json() as string);
            return response;
        });
}
getUnitData(): Promise < any > {
    //Load units

    return this.http.get('http://localhost:5000/api/UnitSetup/units/' + OwnerID).toPromise().then(result => {
        let responses = result.json() as string;
        console.log(result.json() as string);
        return responses;
    });
       
}
}

function random(min:number, max:number):number
{
    return Math.floor(Math.random() * max) + min;
}