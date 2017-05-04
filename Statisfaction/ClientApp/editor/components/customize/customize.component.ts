import { Component, AfterViewInit } from '@angular/core';
import { SurveyConfigService } from '../survey-config.service';
import { WidgetBase, WSmileyModel } from '../../../models/models';

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
        new WidgetType("Smiley", "/images/icons/widget_smiley.png"),
        new WidgetType("Question", "/images/icons/widget_question.png")
    ];

    surveydata: SurveyConfigService = null;

    constructor(private config: SurveyConfigService) {
        this.surveydata = config;
    }

    addWidget(widget: WidgetType) {

        var w = new WidgetBase(widget.type, "");

        switch (w.type) {
            case "Smiley":
                w.content = JSON.stringify(new WSmileyModel());
                break;
            case "Question":
                //TODO: w.content = JSON.stringify(new WQuestionModel()); 
                break;
        }

        this.surveydata.addWidget(w);
    }

    selectWidget(widget: WidgetBase) {
        this.surveydata.selectedWidget = this.surveydata.widgets.find(m => m.id == widget.id);
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

export class WidgetType {
    constructor
        (
        public type: string,
        public icon: string
        ) { }
}

