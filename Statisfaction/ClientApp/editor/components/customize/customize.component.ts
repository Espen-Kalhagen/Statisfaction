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

    // Holds the
    widgetTypes = 
    [
        new WidgetType("Smiley","/images/icons/widget_smiley.png"), 
        new WidgetType("Question","/images/icons/widget_question.png")
    ];

    selectedWidget: WidgetModel = null;

    surveydata: SurveyConfigService = null;

    constructor(private config: SurveyConfigService) {
        this.surveydata = config;
    }

    addWidget(widget:WidgetType) {
        this.surveydata.addWidget(new WidgetModel(widget.type, "",widget.icon));
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

export class WidgetType
{
    constructor
    (
        public type:string,
        public icon:string
    ){}
}

