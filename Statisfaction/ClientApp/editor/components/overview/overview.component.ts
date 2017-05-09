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

    surveys:SurveyInfoModel[] = [];

    constructor()
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

    getSurveys()
    {

    }

}