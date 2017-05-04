import { Injectable } from '@angular/core';
import { WSmileyModel, WidgetBaseModel } from '../../models/models';

@Injectable()
export class SurveyConfigService {

    private MAX_WIDGETS = 7;

    // General parameters
    surveyTitle: string = '';
    surveyDescription: string = '';

    surveyID: string = '';

    //---------------------------------------------

    widgets: WidgetBaseModel[] = [];

    selectedIndex:number = -1 ;
    selectedType:string = null ;

    getCurrentWidget()
    {

        if(this.selectedIndex == -1)
        {
            return null ;
        }

        return this.widgets[this.selectedIndex];
    }

    // -------------------------- Functions -------------------------
    addWidget(widget: WidgetBaseModel): void {

        if (this.widgets.length < this.MAX_WIDGETS)
            this.widgets.push(widget);
        else
            alert("Cant add more than " + this.MAX_WIDGETS + " widgets per survey!");
    }

    removeWidget(widgetClicked:WidgetBaseModel) {
        
        let wi = this.widgets.find(m => m.localID === widgetClicked.localID);
        let index = this.widgets.indexOf(wi);

        if (index > -1)
            this.widgets.splice(index, 1);

        var w = this.widgets[index];

        if (w == null)
            this.selectedIndex = index - 1 ;
    }

    saveDraft(): void {

    }

    saveSurvey(): void {

    }

}