import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SurveyModel } from '../../../models/models';
import { SurveyDataService } from '../survey-data.service';
import { Router } from '@angular/router';

import { SurveyFilterPipe } from './survey-filter.pipe';

import { EditorSharedDataService } from '../../../editor/editor-shared-data.service';

declare var $: any;

@Component({
    selector: 'survey-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})


export class SurveyOverviewComponent {

    constructor(public surveyService: SurveyDataService, private editorData: EditorSharedDataService, private router: Router) {

        this.surveyService.loadSurveys();
        this.surveyService.loadTemplates();

    }

    onSurveyClicked(survey: object, index: number) {
        this.surveyService.survey = this.surveyService.surveys[index];
    }

    onSortByName() {
        this.surveyService.surveys = this.surveyService.surveys.sort((n1, n2) => {
            if (n1 > n2) {
                return -1;
            }

            if (n1 < n2) {
                return 1;
            }

            return 0;
        });
    }

    onSortByUpdated() {

    }

    createNewSurvey() {
        this.editorData.modelIsEdit = false;
        this.editorData.currentModel = null;
        this.router.navigate(['/client/editor']);
    }

    createNewSurveyFromTemplate(model: SurveyModel) {
        this.editorData.modelIsEdit = false;
        this.editorData.currentModel = model;
        this.router.navigate(['/client/editor']);
    }
}