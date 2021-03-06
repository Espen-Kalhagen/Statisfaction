import { Component } from '@angular/core';
import { Http, RequestOptions, Headers  } from '@angular/http';
import { Observable } from "rxjs/Rx";
import { RegisterStoreUnitModel } from "../../../models/models";

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
    public hasUnits:boolean = false;
    private http:Http;
    private availableSurveys: SurveyData[] = []; 
    public unitModel: RegisterStoreUnitModel;
    constructor(http: Http) {
        this.http = http;
        console.log("OwnerID: " + OwnerID);
    };

    ngOnInit(){

        this.unitModel = new RegisterStoreUnitModel();
        //Load surveys
        this.http.get('/api/UnitSetup/surveys/' + OwnerID).subscribe(result => {
            let surveyData = result.json();
            for(let survey of surveyData){
                let generalData:SurveyData = new SurveyData(survey.general.title, survey.general.surveyID);
                this.availableSurveys.push(generalData)
            }
            console.log(result.json() as string);
        });
        //Load units
        this.http.get('/api/UnitSetup/units/' + OwnerID).subscribe(result => {
            this.responses = result.json() as string;
            if(this.responses.length>0){
                this.hasUnits = true;
            }
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
        this.http.post('/api/UnitSetup/bindSurvey', JSON.stringify({ Unitid, surveyID, surveyName }), { headers: headers }).toPromise().then(servResp => alert("Applied! Store unit refreshed")).catch(error => $("#applied" + unitID).text("Error! Please try later"));
    
}
    unbind(unitID,index) {

        let data = new RegistrationData(Number(this.responses[index].registationPin));
        let body = JSON.stringify(data );
        let options = new RequestOptions();
        options.headers = new Headers({ 'Content-Type': 'application/json' });

        this.http.post('/api/UnitSetup/unregister', body, options).catch(err => {
            alert("Failed to unbind");
            return Observable.throw(err); // observable needs to be returned or exception raised
        }).subscribe(res => 
        {console.log("Unbound!");
            this.responses[index].confirmed = false;
    });
    }

    delete(unitID,index){
        if (confirm('WARNING! Are you sure you want to delete this store unit? It will also delete all information collected by it!')) {
             
            let options = new RequestOptions();
            this.http.delete('/api/UnitSetup/unit/' + unitID, options).catch(err => {
                alert("Failed to delete");
                return Observable.throw(err); // observable needs to be returned or exception raised
            }).subscribe(res => {
                this.responses.splice(index,1);
                this.hasUnits = false;
            });
        }
    }
    
    register(){
        this.hasUnits = true;
        this.unitModel.OwnerID = OwnerID
        let body = JSON.stringify(this.unitModel);
        let options = new RequestOptions();
        options.headers = new Headers({ 'Content-Type': 'application/json' });

        this.http.post('/api/UnitSetup/addUnit', body, options).catch(err => {
            alert("Failed to add new unit");
            return Observable.throw(err); // observable needs to be returned or exception raised
        }).subscribe(res => {
            let unit = res.json() as string
            this.responses.unshift(unit);
        });


        this.unitModel = new RegisterStoreUnitModel();

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