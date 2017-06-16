import { Injectable } from '@angular/core';
import { SurveyModel } from '../../models/models';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

declare var $: any;

declare var OwnerID: any;

@Injectable()
export class SurveyDataService {

    public surveys: SurveyModel[] = [];

    public templates: SurveyModel[] = [];

    public survey: SurveyModel = null;

    constructor(private http: Http) {

    }

    public loadSurveys() {

        let url = '/api/UnitSetup/getSurveys/' + OwnerID;

        this.http.get(url).subscribe(result => {
            this.surveys = result.json() as SurveyModel[];
        });

    }

    public loadTemplates() {

        let url = '/api/UnitSetup/getTemplates';

        this.http.get(url).subscribe(result => {
            this.templates = result.json() as SurveyModel[];
        });
    }
}