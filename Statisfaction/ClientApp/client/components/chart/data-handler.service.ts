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


getStatisticsResponces(){
    var data =

        {
            "summary": {
                "nrOfResponses": 4,
                "completePersentage": 70,
                "completnessFactor": 80,
                "date": "23:02:2017",
                "timeStart": 8,
                "timeEnd": 13
            },
            "questions": [
                {
                    "id": 21,
                    "title": "How was the experience?",
                    "type": "QuestionWidget",
                    "answers": [
                        {
                            "id": 1,
                            "text": "Very satisfied",
                            "color": "#00759A",
                            "countPerHour": [
                                {
                                    "hour": 8,
                                    "count": 2
                                },
                                {
                                    "hour": 9,
                                    "count": 3
                                },
                                {
                                    "hour": 10,
                                    "count": 1
                                },
                                {
                                    "hour": 11,
                                    "count": 2
                                },
                                {
                                    "hour": 12,
                                    "count": 6
                                },
                                {
                                    "hour": 13,
                                    "count": 2
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "text": "Satisfied",
                            "color": "#A6BCC6",
                            "countPerHour": [
                                {
                                    "hour": 8,
                                    "count": 4
                                },
                                {
                                    "hour": 9,
                                    "count": 5
                                },
                                {
                                    "hour": 10,
                                    "count": 2
                                },
                                {
                                    "hour": 11,
                                    "count": 4
                                },
                                {
                                    "hour": 12,
                                    "count": 5
                                },
                                {
                                    "hour": 13,
                                    "count": 5
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "text": "Unsatisfied",
                            "color": "#A6BCC6",
                            "countPerHour": [
                                {
                                    "hour": 8,
                                    "count": 1
                                },
                                {
                                    "hour": 9,
                                    "count": 2
                                },
                                {
                                    "hour": 10,
                                    "count": 2
                                },
                                {
                                    "hour": 11,
                                    "count": 1
                                },
                                {
                                    "hour": 12,
                                    "count": 4
                                },
                                {
                                    "hour": 13,
                                    "count": 3
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "text": "Very unsatisfied",
                            "color": "#A6BCC6",
                            "countPerHour": [
                                {
                                    "hour": 8,
                                    "count": 0
                                },
                                {
                                    "hour": 9,
                                    "count": 0
                                },
                                {
                                    "hour": 10,
                                    "count": 0
                                },
                                {
                                    "hour": 11,
                                    "count": 1
                                },
                                {
                                    "hour": 12,
                                    "count": 2
                                },
                                {
                                    "hour": 13,
                                    "count": 2
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 22,
                    "title": "How satisfied are you?",
                    "type": "SmileyWidget",
                    "answers": [
                        {
                            "id": 1,
                            "text": "Happy",
                            "color": "#FFFFFF",
                            "countPerHour": [
                                {
                                    "hour": 8,
                                    "count": 2
                                },
                                {
                                    "hour": 9,
                                    "count": 3
                                },
                                {
                                    "hour": 10,
                                    "count": 1
                                },
                                {
                                    "hour": 11,
                                    "count": 2
                                },
                                {
                                    "hour": 12,
                                    "count": 3
                                },
                                {
                                    "hour": 13,
                                    "count": 3
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "text": "Very happy",
                            "color": "#FFFFFF",
                            "countPerHour": [
                                {
                                    "hour": 8,
                                    "count": 2
                                },
                                {
                                    "hour": 9,
                                    "count": 1
                                },
                                {
                                    "hour": 10,
                                    "count": 1
                                },
                                {
                                    "hour": 11,
                                    "count": 1
                                },
                                {
                                    "hour": 12,
                                    "count": 0
                                },
                                {
                                    "hour": 13,
                                    "count": 2
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    return data;
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