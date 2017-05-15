import { Component, AfterViewInit } from '@angular/core';

import { SurveyConfigService, SIDEBAR_STATES } from '../survey-config.service';

import { GeneralModel } from '../../../models/models';

declare var $: any;

@Component({
    selector: 'general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css']
})

export class GeneralComponent{


    constructor(private sharedData: SurveyConfigService) {
        this.sharedData.state = SIDEBAR_STATES.GENERAL;

    }

}