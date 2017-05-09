import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { SurveyInfoModel} from '../../../models/models';

declare var $: any;

@Component({
    selector: 'survey-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})


export class SurveyOverviewComponent
{
    // List of all surveys
    surveys:SurveyInfoModel[] = [];

    // Constructor
    constructor()
    {

        this.getSurveys();

    }

    // This should call the API and retrieve the surveys for the user
    getSurveys()
    {
        this.getDummyData();
    }

    // This is only used temporary do create some dummy surveys!
    getDummyData()
    {
        var m = new SurveyInfoModel();
        m.created = new Date();
        m.updated = new Date();
        m.description = "Some description";
        m.title = "Survey 1";

        this.surveys.push(m);

        var m2 = new SurveyInfoModel();
        m2.created = new Date();
        m2.updated = new Date();
        m2.description = "Some description";
        m2.title = "Survey 2";

        m2.created.toDateString();

        this.surveys.push(m2);
    }

}