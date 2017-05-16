import { Component, AfterViewInit } from '@angular/core';
import { SurveyConfigService } from '../survey-config.service';
import { WSmileyModel, WidgetBaseModel} from '../../../models/models';

declare var $: any;

@Component({
    selector: 'customize-sidebar',
    templateUrl: './customize-sidebar.component.html',
    styleUrls: ['./customize-sidebar.component.css', '../general-sidebar/general-sidebar.component.css']
})

export class CustomizeSidebarComponent {
   
    // Holds the
    widgetTypes =
    [
        new WidgetType("Smiley", "/images/icons/widget_smiley.png"),
        new WidgetType("Question", "/images/icons/widget_question.png")
    ];

    constructor(private sharedData: SurveyConfigService) {
        
    }

    addWidget(widget: WidgetType) {

        var w = new WidgetBaseModel();
        w.type = widget.type ;
        this.sharedData.addWidget(w);
    }

    selectWidget(widget: object, index:number) {

        let w = widget as WidgetBaseModel ;

        this.sharedData.selectedIndex = index ;
        this.sharedData.selectedType = w.type ;
        this.sharedData.selectedID = w.widgetID ;
    }

    removeWidget(widget: WidgetBaseModel)
    {
        this.sharedData.removeWidget(widget);
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

