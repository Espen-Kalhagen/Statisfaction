import { Component, Input, AfterViewInit } from '@angular/core';
import { SurveyInfoModel } from '../../../models/models';
import {SurveyDataService} from '../survey-data.service';

declare var $: any;

@Component({
    selector: 'survey-summary',
    templateUrl: './survey-summary.component.html',
    styleUrls: ['./survey-summary.component.css']
})


export class SurveySummaryComponent implements AfterViewInit {


    constructor(private surveyService:SurveyDataService) 
    {
        
    }

    /*
     * Gets called when the user clicks delete on the survey.
     */
    onClickedDelete()
    {
        // Ask the user if he is sure
        // Call the API to remove the survey
        // Wait for API-response. Remove from list if successful!
    }
    
    /*
     * Gets called when the user clicks edit on the survey
     */
    onClickedEdit()
    {
        // If the survey is in production. Dont continue
        // Go to the editor!
    }

    saveChanges()
    {
        // Save the changes made (Call the API)
    }


    ngAfterViewInit() {

        $('.editable').mouseenter(goToEditState);
        $('.editable').mouseleave(goToViewState);

        function goToViewState() {
            console.log("Unhover!");
            var text = $(this).val();
            var textView = $('<p class="editable">');
            textView.html(text);
            textView.mouseenter(goToEditState);
            $(this).replaceWith(textView);
        }

        function goToEditState() {
            console.log("Hover!");
            var text = $(this).html();

            var textField = $('<textarea class="editable form-control" rows="3" />').css({ 'width': '100%' });
            textField.val(text);

            textField.mouseleave(goToViewState);
            $(this).replaceWith(textField);
        }
    }
}