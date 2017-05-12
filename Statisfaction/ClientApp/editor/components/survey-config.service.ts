import { Injectable } from '@angular/core';
import { WSmileyModel, WidgetBaseModel, GeneralModel, SurveyModel, WThankYouModel } from '../../models/models';

export enum SIDEBAR_STATES {GENERAL, EDITOR, DEPLOY };

@Injectable()
export class SurveyConfigService {

    public state:SIDEBAR_STATES = SIDEBAR_STATES.GENERAL ;

    private MAX_WIDGETS = 20;

    surveyID: string = '';

    // General parameters
    general:GeneralModel = new GeneralModel() ;

    widgets: WidgetBaseModel[] = [];

    otherInfo: WThankYouModel = new WThankYouModel();

    selectedIndex:number = -1 ;
    selectedType:string = null ;
    selectedID:string = null ;

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
        
        let wi = this.widgets.find(m => m.widgetID === widgetClicked.widgetID);
        let index = this.widgets.indexOf(wi);

        if (index > -1)
            this.widgets.splice(index, 1);

        var w = this.widgets[index];

        if (w == null)
            this.selectedIndex = index - 1 ;
    }

    deploy()
    {
        let survey = new SurveyModel(this.general, this.widgets, this.otherInfo);

        let payload = JSON.stringify(survey);

        alert(payload);
    }

}