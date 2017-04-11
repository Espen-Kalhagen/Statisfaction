import { Injectable } from '@angular/core';
import { WidgetModel } from '../../models/models';

@Injectable()
export class SurveyConfigService
{

    private MAX_WIDGETS = 7 ;

    // General parameters
    surveyTitle:string = '';
    surveyDescription:string = '';

    surveyID:string = '';

    // Widget-spesific parameters
    widgets:WidgetModel[] = [];

    // -------------------------- Functions -------------------------
    addWidget(widget:WidgetModel) : void
    {

        if(this.widgets.length < this.MAX_WIDGETS )
            this.widgets.push(widget);
        else
            alert("Cant add more than " + this.MAX_WIDGETS + " widgets per survey!");
    }

    removeWidget(widget:WidgetModel)
    {
        var index = this.widgets.indexOf(widget);

        if(index > -1)
            this.widgets.splice(index,1);
    }

    saveDraft() : void
    {

    }

    saveSurvey() : void
    {

    }

}