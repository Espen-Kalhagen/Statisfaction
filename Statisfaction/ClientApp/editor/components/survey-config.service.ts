import { Injectable, Inject } from '@angular/core';
import { WSmileyModel, WidgetBaseModel, GeneralModel, SurveyModel, WThankYouModel, UUID } from '../../models/models';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';


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

    public surveyID: string = '';

    // General parameters
    public general: GeneralModel = new GeneralModel();

    // An array that holds all of he widgets
    public widgets: WidgetBaseModel[] = [];

    // Other info about the survey (Thankyou and timers)
    public otherInfo: WThankYouModel = new WThankYouModel();

    // Used to detect changes in data model
    public selectedIndex: number = -1;
    public selectedType: string = null;
    public selectedID: string = null;

    public form: FormGroup;

    /*
     * Constructs a new SurveyConfigService 
     * The service holds data that are shared between editor-components
     * 
     * Http and EditorSharedDataService is injected so that we can use this services later
     */
    constructor(private editorData: EditorSharedDataService, private http: Http, @Inject(FormBuilder) private fbuilder: FormBuilder) {

        if (editorData.currentModel != null) {
            this.general = editorData.currentModel.general;
            this.widgets = editorData.currentModel.widgets;
            this.otherInfo = editorData.currentModel.thankYou;

            if (editorData.modelIsEdit == false) {
                this.general.surveyID = UUID.newUUID();
            }
        }

        this.general.created = new Date();


        this.form = fbuilder.group({
            'general.title': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            'general.description': ['', Validators.required],
            'general.color': [''],
            'general.logoUrl': [''],
            'otherInfo.thankyou': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            'otherInfo.delay': ['4', Validators.compose([Validators.required])],
            'general.timeout': ['7', Validators.compose([Validators.required])]
        });
    }

    getCurrentWidget() {

        if (this.selectedIndex == -1) {
            return null;
        }

        return this.widgets[this.selectedIndex];
    }

    // -------------------------- Functions -------------------------
    addWidget(widget: WidgetBaseModel): void {

        if (this.widgets.length >= this.MAX_WIDGETS) {

            alert("Cant add more than " + this.MAX_WIDGETS + " widgets per survey!");
            return;
        }

        this.widgets.push(widget);

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

        this.general.ownerID = OwnerID;
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