import { Component, Input, AfterViewInit } from '@angular/core';

import { Router } from '@angular/router';

import { SurveyModel } from '../../../models/models';
import { SurveyDataService } from '../survey-data.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { EditorSharedDataService } from '../../../editor/editor-shared-data.service';

declare var $: any;

@Component({
    selector: 'survey-summary',
    templateUrl: './survey-summary.component.html',
    styleUrls: ['./survey-summary.component.css']
})


export class SurveySummaryComponent implements AfterViewInit {


    constructor(private surveyService: SurveyDataService, private editorData: EditorSharedDataService, private http: Http, private router: Router) {
    }

    /*
     * Gets called when the user clicks delete on the survey.
     */
    onClickDelete() {
        // TODO: Ask the user if he is sure

        let payload = JSON.stringify(this.surveyService.survey);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let url = 'http://localhost:5000/api/UnitSetup/deleteSurvey/' + this.surveyService.survey.general.surveyID;

        this.http.delete(url).subscribe(
            (response) => {

                if (response.status == 200) {
                    var index = this.surveyService.surveys.indexOf(this.surveyService.survey);
                    if (index > -1)
                        this.surveyService.surveys.splice(index, 1);

                    this.surveyService.survey = null;
                }
            },
            (err) => {
                console.log("ERROR: " + err);
            },
            () => {
                console.log("COMPLETED");
            }
        );
    }

    /*
     * Gets called when the user clicks edit on the survey
     */
    onClickEdit() {
        this.editorData.modelIsEdit = true;
        this.editorData.currentModel = this.surveyService.survey;
        this.router.navigate(['/client/editor']);
    }

    onClickDuplicate() {

        this.editorData.modelIsEdit = false;
        this.editorData.currentModel = this.surveyService.survey;

        this.editorData.currentModel.general.title = "DUPLICATE OF: " + this.editorData.currentModel.general.title;
        this.editorData.currentModel.general.surveyID = "";
        this.router.navigate(['/client/editor']);
    }

    onCloseDetail() {
        this.surveyService.survey = null;
    }

    saveChanges() {

        let payload = JSON.stringify(this.surveyService.survey);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let url = 'http://localhost:5000/api/UnitSetup/saveSurvey';

        this.http.post(url, payload, options).subscribe(
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


    ngAfterViewInit() {

        var self = this;

        $('.editable').mouseenter(enter);

        function leave() {
            $(this).off();
            $(this).removeClass("form-control");
            $(this).addClass("editable-style");
            $(this).mouseenter(enter);
        }

        function click() {
            $(this).off();
            $(this).focusout(lostFocus);
        }

        function lostFocus() {
            $(this).off();
            $(this).mouseenter(enter);
            $(this).removeClass("form-control");
            $(this).addClass("editable-style");

            self.saveChanges();
        }

        function enter() {
            $(this).off();
            $(this).addClass("form-control");
            $(this).removeClass("editable-style");
            $(this).mouseleave(leave);
            $(this).click(click);
        }
    }
}