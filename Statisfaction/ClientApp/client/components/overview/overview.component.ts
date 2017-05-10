import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { SurveyInfoModel} from '../../../models/models';
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

        this.getSurveys();

    }

    // This should call the API and retrieve the surveys for the user
    getSurveys()
    {
        this.getDummyData();
    }

    onSurveyClicked(survey:object, index:number)
    {
        this.surveyService.survey = this.surveyService.surveys[index];
    }

    // This is only used temporary do create some dummy surveys!
    getDummyData()
    {
        var m = new SurveyInfoModel();
        m.created = new Date();
        m.updated = new Date();
        m.description = "Some description";
        m.title = "Survey 1";

        this.surveyService.surveys.push(m);

        var m2 = new SurveyInfoModel();
        m2.created = new Date();
        m2.updated = new Date();
        m2.description = "Some description";
        m2.title = "Survey 2";

        m2.created.toDateString();

        this.surveyService.surveys.push(m2);
    }

}