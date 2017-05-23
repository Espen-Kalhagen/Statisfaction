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
import { GeneralModel } from "../../../models/models";

declare var delay: any;

@Component({
    selector: 'store-unit',
    providers: [CookieService, SendingService],
    templateUrl: './store-unit.component.html',
    styleUrls: ["./store-unit.component.css"]
})

export class StoreUnitComponent {

    cookieContent: any;
    nextWidgetIndex:any =0;
    widgets:any[] = [];
    @ViewChild(WidgetDirective) widgetHost: WidgetDirective;
    timer:number;
    currentSurveyID:string;
    cookieObject: any;
    model:GeneralModel ;



    public constructor(
        private router: Router,
        private http: Http,
        private cookie: CookieService,
        private sendingService: SendingService,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        this.model = new GeneralModel();
    }
    ngAfterViewInit() {
        //Check registration
        if (!this.cookie.check('StoreUnitCookie')) {
            this.router.navigate(['/register-unit'], { skipLocationChange: true })
            return;
        }
        console.log("found cookie: " + this.cookie.get('StoreUnitCookie'));
        this.cookieContent = this.cookie.get('StoreUnitCookie');
        this.cookieObject = JSON.parse(this.cookieContent);
        let data = new RegistrationCheckData(
            this.cookieObject.id,
            this.cookieObject.ownerID,
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
            this.currentSurveyID = "c2c841d0-9257-495c-832e-0adc424b17ec"; 
        } 

        //Get survey data:
        //From the server
        let surveyData;
        //load the data above, but from the server
        //TODO:change 100 to surveyID
        console.log("get surveydata");
        this.http.get('http://localhost:5000/api/UnitSetup/survey/' + this.currentSurveyID).subscribe(result => {

            surveyData = result.json();
            this.model = surveyData.general as GeneralModel;
            delay = this.model.timeoutDelay;
            console.log(surveyData);

            console.log(surveyData.general.surveyID);
            for (let i = 0; i < surveyData.widgets.length; i++) {
                if (surveyData.widgets[i].type == "Question") {
                    this.widgets[i] = new WidgetInfo(surveyData.widgets[i], QuestionWidgetComponent);

                } else if (surveyData.widgets[i].type == "Smiley") {
                    surveyData.widgets[i].color = surveyData.general.color;
                    this.widgets[i] = new WidgetInfo(surveyData.widgets[i], SmileyWidgetComponent);
                }
                else {
                    console.log("ERROR ADDING " + i);
                }
            }

            this.widgets.push(new WidgetInfo(surveyData.thankYou, ThanksWidgetComponent))

            this.sendingService.init(this.cookieObject.id);
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
        (<WidgetComponent>componentRef.instance).SurveyID = this.currentSurveyID;
        //Reset view if idle

        this.timer = window.setTimeout(() => {
            this.loadComponent(this.widgets[0]);
            this.nextWidgetIndex = 0;
        }, delay*1001);
    }
    //Emmited by store unit widgets
    onAnswered(answered: boolean) {

        this.nextWidgetIndex++;

        if (this.nextWidgetIndex >= this.widgets.length) {
            this.nextWidgetIndex = 0;
            this.sendingService.sendNow();
        }
        console.log("Going to next widget of type: " + this.widgets[this.nextWidgetIndex].WidgetData.type);
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

