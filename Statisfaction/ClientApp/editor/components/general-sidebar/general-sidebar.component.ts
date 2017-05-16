import { Component } from '@angular/core';

import { SurveyConfigService } from '../survey-config.service';

import { GeneralModel } from '../../../models/models';

@Component({
    selector: 'general-sidebar',
    templateUrl: './general-sidebar.component.html',
    styleUrls: ['./general-sidebar.component.css']
})

export class GeneralSidebarComponent 
{


    constructor(private sharedData: SurveyConfigService)
    {
        
    }
    
}
