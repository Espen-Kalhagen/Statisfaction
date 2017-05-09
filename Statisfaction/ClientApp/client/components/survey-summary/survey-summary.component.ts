import { Component, Input, AfterViewInit } from '@angular/core';
import { SurveyInfoModel } from '../../../models/models';

declare var $: any;

@Component({
    selector: 'survey-summary',
    templateUrl: './survey-summary.component.html',
    styleUrls: ['./survey-summary.component.css']
})


export class SurveySummaryComponent implements AfterViewInit {

    surveys: SurveyInfoModel[] = [];

    constructor() {

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