import { Injectable } from '@angular/core';
import { WSmileyModel, WidgetBaseModel, GeneralModel, SurveyModel, WThankYouModel, UUID } from '../../models/models';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { EditorSharedDataService } from '../editor-shared-data.service';

export enum SIDEBAR_STATES { GENERAL, EDITOR, DEPLOY };

declare var $: any;

declare var OwnerID: any;


@Injectable()
export class SurveyConfigService {

    // Holds the current state of the editor, the sidbar uses this do decide which sidebar to show
    public state: SIDEBAR_STATES = SIDEBAR_STATES.GENERAL;

    // The maximum amount of widgets allowed in one survey
    private MAX_WIDGETS = 20;

    surveyID: string = '';

    // General parameters
    general: GeneralModel = new GeneralModel();

    // An array that holds all of he widgets
    widgets: WidgetBaseModel[] = [];

    // Other info about the survey (Thankyou and timers)
    otherInfo: WThankYouModel = new WThankYouModel();

    // Used to detect changes in data model
    selectedIndex: number = -1;
    selectedType: string = null;
    selectedID: string = null;

    /*
     * Constructs a new SurveyConfigService 
     * The service holds data that are shared between editor-components
     * 
     * Http and EditorSharedDataService is injected so that we can use this services later
     */
    constructor(private http: Http, private editorData:EditorSharedDataService) 
    {

        if(editorData.currentModel != null)
        {
            this.general = editorData.currentModel.general;
            this.widgets = editorData.currentModel.widgets;
            this.otherInfo = editorData.currentModel.thankYou;
            
            if(editorData.modelIsEdit == false)
            {
                this.general.surveyID = UUID.newUUID();
            }
        }

        this.general.created = new Date();
        
        console.log("Creating new survey");
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


    removeWidget(widgetClicked: WidgetBaseModel) {

        let wi = this.widgets.find(m => m.widgetID === widgetClicked.widgetID);
        let index = this.widgets.indexOf(wi);

        if (index > -1)
            this.widgets.splice(index, 1);

        var w = this.widgets[index];

        if (w == null)
            this.selectedIndex = index - 1;
    }

    deploy() {
        
        this.general.ownerID = OwnerID ;
        this.general.updated = new Date();

        let survey = new SurveyModel(this.general, this.widgets, this.otherInfo);

        let payload = JSON.stringify(survey);
        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let url = 'http://localhost:5000/api/UnitSetup/saveSurvey';

        this.http.post(url, payload, options).subscribe(
            (response) => {
                /* this function is executed every time there's a new output */
                alert("Saved")
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
}