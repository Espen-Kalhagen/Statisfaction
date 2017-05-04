import { Component } from '@angular/core';

import { SurveyConfigService } from '../survey-config.service';

import { GeneralModel } from '../../../models/models';

@Component({
    selector: 'general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css']
})

export class GeneralComponent 
{

    data:SurveyConfigService = null ;

    constructor(private config: SurveyConfigService)
    {
        this.data = config ;
    }
    
}
