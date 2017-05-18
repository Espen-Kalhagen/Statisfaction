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
        // Ask the user if he is sure
        // Call the API to remove the survey
        // Wait for API-response. Remove from list if successful!
    }

    /*
     * Gets called when the user clicks edit on the survey
     */
    onClickEdit() {
        // If the survey is in production. Dont continue
        // Go to the editor!
    }

    onClickDuplicate() {
        this.editorData.currentModel = this.surveyService.survey;
        this.editorData.currentModel.general.surveyID = null;
        this.router.navigate(['/client/editor']);
    }

    onCloseDetail() {
        this.surveyService.survey = null;
    }

    saveChanges() {

        let payload = JSON.stringify(this.surveyService.survey);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let url = 'http://localhost:5000/api/UnitSetup/editSurvey';

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