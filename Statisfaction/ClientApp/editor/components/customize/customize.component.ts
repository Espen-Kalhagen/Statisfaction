import { Component, AfterViewInit } from '@angular/core';
import { SurveyConfigService } from '../survey-config.service';
import { WidgetModel } from '../../../models/models';

declare var $: any;

@Component({
    selector: 'customizer',
    templateUrl: './customize.component.html',
    styleUrls: ['./customize.component.css']
})

export class CustomizeComponent implements AfterViewInit {

    widgetTypes = ["Smiley", "Question"];

    selectedWidget: WidgetModel = null;

    surveydata: SurveyConfigService = null;

    constructor(private config: SurveyConfigService) {
        this.surveydata = config;
    }

    addWidget(type: string) {
        this.surveydata.addWidget(new WidgetModel(type, ""));
    }

    selectWidget(widget: WidgetModel) {
        this.selectedWidget = widget;
    }

    ngAfterViewInit() {

        $('#sortable').sortable(
            {
                placeholder: 'col-md-1 panel-al-placeholder',
                dropOnEmpty: true,
                helper: 'clone'
            });

        $('#sortable').disableSelection();
    }

}

