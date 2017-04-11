import { Component } from '@angular/core';

import { SurveyConfigService } from '../survey-config.service';

@Component({
    selector: 'general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css']
})

export class GeneralComponent 
{

    name:string = "Kjell";

    constructor(private config: SurveyConfigService)
    {
        this.name = config.surveyTitle ; 
    }
    
}
