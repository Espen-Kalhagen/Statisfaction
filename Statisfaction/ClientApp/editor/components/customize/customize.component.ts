import { Component, AfterViewInit } from '@angular/core';
import { SurveyConfigService } from '../survey-config.service';
import { WSmileyModel, WidgetBaseModel} from '../../../models/models';

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

        var w = new WidgetBaseModel();
        w.type = widget.type ;
        this.surveydata.addWidget(w);
    }

    selectWidget(widget: object, index:number) {

        let w = widget as WidgetBaseModel ;

        this.surveydata.selectedIndex = index ;
        this.surveydata.selectedType = w.type ;
        this.surveydata.selectedID = w.localID ;
    }

    removeWidget(widget: WidgetBaseModel)
    {
        this.surveydata.removeWidget(widget);
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

