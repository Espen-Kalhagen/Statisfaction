import { Injectable } from '@angular/core';
import { WSmileyModel, WidgetBaseModel, GeneralModel, SurveyModel, WThankYouModel } from '../../models/models';
<<<<<<< HEAD

export enum SIDEBAR_STATES {GENERAL, EDITOR, DEPLOY };
=======
import { Http, Response, Headers, RequestOptions } from '@angular/http';

export enum SIDEBAR_STATES { GENERAL, EDITOR, DEPLOY };

declare var $: any;

declare var OwnerID: any;
>>>>>>> STAT-56-QuestionEditor

@Injectable()
export class SurveyConfigService {

<<<<<<< HEAD
    public state:SIDEBAR_STATES = SIDEBAR_STATES.GENERAL ;
=======
    public state: SIDEBAR_STATES = SIDEBAR_STATES.GENERAL;
>>>>>>> STAT-56-QuestionEditor

    private MAX_WIDGETS = 20;

    surveyID: string = '';

    // General parameters
<<<<<<< HEAD
    general:GeneralModel = new GeneralModel() ;
=======
    general: GeneralModel = new GeneralModel();
>>>>>>> STAT-56-QuestionEditor

    widgets: WidgetBaseModel[] = [];

    otherInfo: WThankYouModel = new WThankYouModel();

<<<<<<< HEAD
    selectedIndex:number = -1 ;
    selectedType:string = null ;
    selectedID:string = null ;
=======
    selectedIndex: number = -1;
    selectedType: string = null;
    selectedID: string = null;
>>>>>>> STAT-56-QuestionEditor

    constructor(private http: Http) {

    }

    getCurrentWidget() {

        if (this.selectedIndex == -1) {
            return null;
        }

        return this.widgets[this.selectedIndex];
    }

    // -------------------------- Functions -------------------------
    addWidget(widget: WidgetBaseModel): void {

        if (this.widgets.length < this.MAX_WIDGETS)
            this.widgets.push(widget);
        else
            alert("Cant add more than " + this.MAX_WIDGETS + " widgets per survey!");
    }

<<<<<<< HEAD
    removeWidget(widgetClicked:WidgetBaseModel) {
        
=======
    removeWidget(widgetClicked: WidgetBaseModel) {

>>>>>>> STAT-56-QuestionEditor
        let wi = this.widgets.find(m => m.widgetID === widgetClicked.widgetID);
        let index = this.widgets.indexOf(wi);

        if (index > -1)
            this.widgets.splice(index, 1);

        var w = this.widgets[index];

        if (w == null)
            this.selectedIndex = index - 1;
    }

<<<<<<< HEAD
    deploy()
    {
        let survey = new SurveyModel(this.general, this.widgets, this.otherInfo);

        let payload = JSON.stringify(survey);

        alert(payload);
=======
    deploy() {
        
        this.general.ownerID = OwnerID ;
        let survey = new SurveyModel(this.general, this.widgets, this.otherInfo);

        let payload = JSON.stringify(survey);
        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let url = 'http://localhost:5000/api/UnitSetup/survey';

        this.http.post(url, payload, options).subscribe(
            (response) => {
                /* this function is executed every time there's a new output */
                alert(response.json() as string)
            },
            (err) => {
                /* this function is executed when there's an ERROR */
                console.log("ERROR: " + err);
            },
            () => {
                /* this function is executed when the observable ends (completes) its stream */
                console.log("COMPLETED");
            }
        );

    }

    success() {
        alert("Success occured!");
    }

    error() {
        alert("Error occured!");
>>>>>>> STAT-56-QuestionEditor
    }

}