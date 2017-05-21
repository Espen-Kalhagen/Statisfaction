import { Component, AfterViewInit } from '@angular/core';
import { SurveyConfigService } from '../survey-config.service';
import { WSmileyModel, WidgetBaseModel } from '../../../models/models';

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
        w.type = widget.type;
        this.sharedData.addWidget(w);
    }

    selectWidget(widget: object, index: number) {

        let w = widget as WidgetBaseModel;

        this.sharedData.selectedIndex = index;
        this.sharedData.selectedType = w.type;
        this.sharedData.selectedID = w.widgetID;
    }

    removeWidget(widget: WidgetBaseModel) {
        this.sharedData.removeWidget(widget);
    }

    ngAfterViewInit() {

        var self = this;

        $('#sortable').sortable(
            {
                placeholder: 'col-md-1 panel-al-placeholder',
                dropOnEmpty: true,
                helper: 'clone',

                start: function (event, ui) {
                    ui.item.startpos = ui.item.index();
                },

                stop: function (event, ui) {

                    var startpos = ui.item.startpos;
                    var endpos = ui.item.index();
                    
                    if (endpos >= self.sharedData.widgets.length) {
                        var k = endpos - self.sharedData.widgets.length;
                        while ((k--) + 1) {
                            self.sharedData.widgets.push(undefined);
                        }
                    }
                    self.sharedData.widgets.splice(endpos, 0, self.sharedData.widgets.splice(startpos, 1)[0]);

                    console.log("Start position: " + startpos);
                    console.log("New position: " + endpos);
                }

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