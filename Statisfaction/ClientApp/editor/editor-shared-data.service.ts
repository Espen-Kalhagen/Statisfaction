import { Injectable } from '@angular/core';
import { WSmileyModel, WidgetBaseModel, GeneralModel, SurveyModel, WThankYouModel } from '../models/models';

@Injectable()
export class EditorSharedDataService {

    public currentModel:SurveyModel = null;

    public modelIsEdit:boolean = false ;

    constructor() 
    {
        console.log("Constructed editorservice!");
        
    }

}