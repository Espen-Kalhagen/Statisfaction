import { Component, Input} from '@angular/core';

import { WidgetModel, WSmileyModel } from '../../../models/models';
import { SurveyConfigService } from '../survey-config.service';

@Component({
    selector: 'widget-smiley-editor',
    templateUrl: './widget-smiley.component.html',
    styleUrls: ['./widget-smiley.component.css']
})

export class WidgetSmileyEditor
{

    @Input() model:WidgetModel ;

    data:SurveyConfigService = null ;

    constructor(private config: SurveyConfigService)
    {
        this.data = config;
    }
}


