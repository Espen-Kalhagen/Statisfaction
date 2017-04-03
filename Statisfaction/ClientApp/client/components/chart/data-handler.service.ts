import { Injectable } from '@angular/core';

@Injectable()
export class DataHandlerService {

    getData(): Promise<number[]> {
        let array:number[] = [];
        for (let i:number = 0; i < 4; i++) {
            array.push(random(0, 10));
        }
        return Promise.resolve(array);
    }
}

function random(min:number, max:number):number
{
    return Math.floor(Math.random() * max) + min;
}