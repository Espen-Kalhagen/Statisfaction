import { Component } from '@angular/core';

import { SurveyConfigService } from '../survey-config.service';

@Component({
    selector: 'general',
    templateUrl: './general.component.html'
})

export class GeneralComponent 
{

    name:string = "Kjell";

    constructor(private config: SurveyConfigService)
    {
        this.name = config.surveyTitle ; 
    }

}
