import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { SurveyModel} from '../../../models/models';
import {SurveyDataService} from '../survey-data.service';

declare var $: any;

@Component({
    selector: 'survey-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})


export class SurveyOverviewComponent
{
    constructor(public surveyService:SurveyDataService)
    {

        this.surveyService.loadSurveys();
    }

    onSurveyClicked(survey:object, index:number)
    {
        this.surveyService.survey = this.surveyService.surveys[index];
    }

}