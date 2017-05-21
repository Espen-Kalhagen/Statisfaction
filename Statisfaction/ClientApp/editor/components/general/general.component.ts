import { Component, AfterViewInit } from '@angular/core';

import { SurveyConfigService, SIDEBAR_STATES } from '../survey-config.service';

import { GeneralModel } from '../../../models/models';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';

declare var $: any;

@Component({
    selector: 'general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css', '../../styles/forms.styles.css']
})

export class GeneralComponent{

    constructor(private sharedData: SurveyConfigService) {
        this.sharedData.state = SIDEBAR_STATES.GENERAL;

    }

    ngAfterViewInit() {
        $('#cp1').colorpicker();
    }

}
