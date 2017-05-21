import { Component } from '@angular/core';
import { SurveyConfigService, SIDEBAR_STATES} from '../survey-config.service';
import { WSmileyModel, WidgetBaseModel} from '../../../models/models';

@Component({
    selector: 'finalizer',
    templateUrl: './finalize.component.html',
    styleUrls:['./finalize.component.css']
})

export class FinalizeComponent {

    constructor(private sharedData: SurveyConfigService) 
    {
        this.sharedData.state = SIDEBAR_STATES.DEPLOY;
    }

    deploySurvey()
    {
        this.sharedData.deploy();
    }

}
