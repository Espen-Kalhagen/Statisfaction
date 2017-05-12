import { Component } from '@angular/core';
import { Http, RequestOptions, Headers  } from '@angular/http';

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
        this.http.get('http://localhost:5000/api/UnitSetup/LoadSurveys/' + OwnerID).subscribe(result => {
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
        this.http.post('http://localhost:5000/api/UnitSetup/UnitSurvey', JSON.stringify({ Unitid, surveyID, surveyName }), { headers: headers }).toPromise().then(servResp => $("#applied" + unitID).text("Done!")).catch(error => $("#applied" + unitID).text("Error! Please try later"));
    
}
}
export class SurveyData {

    constructor(
        public surveyName: string,
        public surveyID: string 
    ) { }
}