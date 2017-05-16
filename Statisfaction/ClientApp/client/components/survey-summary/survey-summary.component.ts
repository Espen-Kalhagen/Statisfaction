import { Component, Input, AfterViewInit } from '@angular/core';
import { SurveyModel } from '../../../models/models';
import { SurveyDataService } from '../survey-data.service';

declare var $: any;

@Component({
    selector: 'survey-summary',
    templateUrl: './survey-summary.component.html',
    styleUrls: ['./survey-summary.component.css']
})


export class SurveySummaryComponent implements AfterViewInit {


    constructor(private surveyService: SurveyDataService) 
    {

    }

    /*
     * Gets called when the user clicks delete on the survey.
     */
    onClickedDelete() {
        // Ask the user if he is sure
        // Call the API to remove the survey
        // Wait for API-response. Remove from list if successful!
    }

    /*
     * Gets called when the user clicks edit on the survey
     */
    onClickedEdit() {
        // If the survey is in production. Dont continue
        // Go to the editor!
    }

    onCloseDetail()
    {
        this.surveyService.survey = null ;
    }

    saveChanges() {
        // Save the changes made (Call the API)
    }


    ngAfterViewInit() {

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
            // Save changes
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