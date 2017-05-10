import { Component, ViewChild, ComponentFactoryResolver, Type } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { RouterModule, Router } from "@angular/router";
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from "rxjs/Rx";
import { SendingService } from "../../SendingService";
import { WidgetDirective } from "./store-unit.directive";
import { SmileyWidgetComponent } from "../../../widgets/components/smiley-widget/smiley-widget.component";
import { WidgetComponent } from "../../../widgets/widget.component";
import { QuestionWidgetComponent } from "../../../widgets/components/question-widget/question-widget.component";
import { ThanksWidgetComponent } from "../../../widgets/components/thanks-widget/thanks-widget.component";

import { WSmileyModel } from '../../../models/models';

@Component({
    selector: 'store-unit',
    providers: [CookieService, SendingService],
    templateUrl: './store-unit.component.html',
    styleUrls: ["./store-unit.component.css"]
})


export class StoreUnitComponent {

    cookieContent: any;
    model: WSmileyModel = new WSmileyModel();
    nextWidgetIndex:any =0;
    widgets:any[] = [];
    @ViewChild(WidgetDirective) widgetHost: WidgetDirective;
    timer:number;
    currentSurveyID:number;
    CookieObject:any;



    public constructor(
        private router: Router,
        private http: Http,
        private cookie: CookieService,
        private sendingService: SendingService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
    }
    ngAfterViewInit() {
        //Check registration
        if (!this.cookie.check('StoreUnitCookie')) {
            this.router.navigate(['/register-unit'], { skipLocationChange: true })
            return;
        }
        console.log("found cookie: " + this.cookie.get('StoreUnitCookie'));
        this.cookieContent = this.cookie.get('StoreUnitCookie');
        this.CookieObject = JSON.parse(this.cookieContent);
        let data = new RegistrationCheckData(
            this.CookieObject.id,
            this.CookieObject.ownerID,
        )

        let body = JSON.stringify(data);
        let options = new RequestOptions();
        options.headers = new Headers({ 'Content-Type': 'application/json' });
        this.http.post('api/UnitSetup/checkRegistration', body, options).catch(err => {
            alert("There was an error in the registration, please log out and in and restart the process");
            this.router.navigate(['/register-unit'], { skipLocationChange: true });
            this.cookie.delete('StoreUnitCookie');
            return Observable.throw(err); // observable needs to be returned or exception raised
        }).subscribe(res => this.handleCheck(res));



    }
    private handleCheck(response: any) {
        let checkResult = JSON.parse(response._body);
        console.log('activation check returned ' + checkResult.confirmed);
        if (!checkResult.confirmed) {
            this.router.navigate(['/register-unit'], { skipLocationChange: true })
        }
        this.currentSurveyID = checkResult.surveyID;

        //Default survey
        if (this.currentSurveyID==null){
            this.currentSurveyID = 100; 
        } 

        //Get survey data:
        //From the server
        let surveyData
        //load the data above, but from the server
        //TODO:change 100 to surveyID
        console.log("get surveydata");
        this.http.get('http://localhost:5000/api/UnitSetup/survey/' + this.currentSurveyID).subscribe(result => {

            surveyData = result.json();
            //surveyData = surveyData[0];
            console.log(surveyData);

            console.log(surveyData.surveyID);
            for (let i = 0; i < surveyData.widgetList.length; i++) {
                if (surveyData.widgetList[i].WidgetType == "Questions") {
                    this.widgets[i] = new WidgetInfo(surveyData.widgetList[i], QuestionWidgetComponent);

                } else if (surveyData.widgetList[i].WidgetType == "Smilies") {
                    this.widgets[i] = new WidgetInfo(surveyData.widgetList[i], SmileyWidgetComponent);
                } else if (surveyData.widgetList[i].WidgetType == "Thanks") {
                    this.widgets[i] = new WidgetInfo(surveyData.widgetList[i], ThanksWidgetComponent);
                }
                else {
                    console.log("ERROR ADDING " + i);
                }
            }

            this.sendingService.init(this.CookieObject.id);
            this.loadComponent(this.widgets[0]);

        });


    }

    private loadComponent(nextWidgetData: WidgetInfo) {
        window.clearTimeout(this.timer);
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(nextWidgetData.WidgetType);
        let viewContainerRef = this.widgetHost.viewContainerRef;
        viewContainerRef.clear()
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<WidgetComponent>componentRef.instance).CookieContent = this.cookieContent;
        (<WidgetComponent>componentRef.instance).surveyPart = nextWidgetData.WidgetData;
        (<WidgetComponent>componentRef.instance).onAnswered = this.widgetHost.onAnswered;

        //Reset view if idle

        this.timer = window.setTimeout(() => {
            this.loadComponent(this.widgets[0]);
            this.nextWidgetIndex = 0;
        }, 5001);
    }
    //Emmited by store unit widgets
    onAnswered(answered: boolean) {

        this.nextWidgetIndex++;

        if (this.nextWidgetIndex >= this.widgets.length) {
            this.nextWidgetIndex = 0;
            this.sendingService.sendNow();
        }
        console.log("Going to next widget of type: " + this.widgets[this.nextWidgetIndex].WidgetData.WidgetType);
        this.loadComponent(this.widgets[this.nextWidgetIndex]);
    }

}
export class RegistrationCheckData {

    constructor(
        public Unitid: number,
        public ownerID: string
    ) { }
}
export class WidgetInfo {
    constructor(
        public WidgetData: any,
        public WidgetType: Type<any>
    ) { }
}

