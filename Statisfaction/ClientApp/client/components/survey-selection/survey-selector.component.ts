import { Component } from '@angular/core';
import { Http, RequestOptions, Headers  } from '@angular/http';
import { Observable } from "rxjs/Rx";

declare var OwnerID: any;
declare var $:any;
declare var Clipboard: any;
@Component({
    selector: 'survey-selector',
    templateUrl: './survey-selector.component.html',
    styleUrls: ['./survey-selector.component.css']
})


export class SelectSurveyComponent 
{
    public responses: any;
    private http:Http;
    private availableSurveys: SurveyData[] = []; //TODO:Load these form server

    constructor(http: Http) {
        this.http = http;
        console.log("OwnerID: " + OwnerID);
    };

    ngOnInit(){
        //Load surveys
        this.http.get('http://localhost:5000/api/UnitSetup/surveys/' + OwnerID).subscribe(result => {
            let surveyData = result.json();
            for(let survey of surveyData){
                let generalData:SurveyData = new SurveyData(survey.general.title, survey.general.surveyID);
                this.availableSurveys.push(generalData)
            }
            console.log(result.json() as string);
        });
        //Load units
        this.http.get('http://localhost:5000/api/UnitSetup/units/' + OwnerID).subscribe(result => {
            this.responses = result.json() as string;
            console.log(result.json() as string);
        });


    }



    apply(unitID){
        let Unitid = unitID;
        let surveyID = $("#surveys" + unitID + " option:selected").val();
        let surveyName = $("#surveys" + unitID + " option:selected").text()
        console.log("Applyed with UnitID: " + Unitid + " And surveyID: " + surveyID);
        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.http.post('http://localhost:5000/api/UnitSetup/bindSurvey', JSON.stringify({ Unitid, surveyID, surveyName }), { headers: headers }).toPromise().then(servResp => $("#applied" + unitID).text("Done!")).catch(error => $("#applied" + unitID).text("Error! Please try later"));
    
}
    unbind(unitID) {
        let posNr;
        for (posNr in this.responses){
            if (this.responses[posNr].id = unitID){
                break;
            }
        }

        let data = new RegistrationData(Number(this.responses[posNr].registationPin));
        let body = JSON.stringify(data );
        let options = new RequestOptions();
        options.headers = new Headers({ 'Content-Type': 'application/json' });

        this.http.post('http://localhost:5000/api/UnitSetup/unregister', body, options).catch(err => {
            alert("Failed to unbind");
            return Observable.throw(err); // observable needs to be returned or exception raised
        }).subscribe(res => console.log("Unbound!"));
    }

    delete(unitID){
        if (confirm('WARNING! Are you sure you want to delete this store unit? It will also delete information collected by it!')) {
            let options = new RequestOptions();
            this.http.delete('http://localhost:5000/api/UnitSetup/unit/' + unitID, options).catch(err => {
                alert("Failed to delete");
                return Observable.throw(err); // observable needs to be returned or exception raised
            }).subscribe(res => alert("Delete successfull! "));

        }
        }

}
export class SurveyData {

    constructor(
        public surveyName: string,
        public surveyID: string 
    ) { }
}
export class RegistrationData {

    constructor(
        public pin: number
    ) { }
}