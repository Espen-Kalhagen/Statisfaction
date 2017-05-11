import { Component, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

import { WQuestionModel } from '../../../models/models';
import { SurveyConfigService } from '../survey-config.service';

declare var $: any;

@Component({
    selector: 'widget-question-editor',
    templateUrl: './widget-question.component.html',
    styleUrls: ['./widget-question.component.css']
})

export class WidgetQuestionEditorComponent implements AfterViewInit, OnChanges {

    private MAX_OPTIONS = 8;

    @Input() selectedIndex: number;

    model: WQuestionModel = null;

    constructor(private sharedData: SurveyConfigService) {

        this.model = sharedData.getCurrentWidget() as WQuestionModel;

        if (this.model.answerList == null) {
            this.model.answerList = [{ "answerText": "", "buttonColor": "", "responseID": "0", "contentIMG": "", "imgSize": 0 }];
        }


    }

    addOption() {
        if (this.model.answerList.length >= this.MAX_OPTIONS) {
            alert("Maksimalt antall svaralternativer nådd!");
            return;
        }

        let responseID = this.model.answerList.length.toString();
        this.model.answerList.push({ "answerText": "", "buttonColor": "", "responseID": responseID, "contentIMG": "", "imgSize": 0 });
    }

    removeOption(index:number) {

        if (index > -1)
            this.model.answerList.splice(index, 1);
    }



    ngAfterViewInit() {
        $('.cp').colorpicker();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.model = this.sharedData.getCurrentWidget() as WQuestionModel;
    }
}


