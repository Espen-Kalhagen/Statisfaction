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

    onSurveyClicked(survey: SurveyModel, index: number) {
        this.surveyService.survey = survey;
    }

    onSortByName() {
        this.surveyService.surveys.sort((n1, n2) => {

            if (n1.general.title > n2.general.title) {
                return 1;
            }

            if (n1.general.title < n2.general.title) {
                return -1;
            }

            return 0;
        });
    }

    onSortByUpdated() {
        this.surveyService.surveys.sort((n1, n2) => {
            var d1 = n1.general.updated as Date;
            var d2 = n2.general.updated as Date;

            if (n1.general.updated.valueOf() > n2.general.updated.valueOf()) {
                return 1;
            }

            if (n1.general.updated.valueOf() < n2.general.updated.valueOf()) {
                return -1;
            }
            return 0;
        });
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