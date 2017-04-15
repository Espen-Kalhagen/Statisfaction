import { Component, Input} from '@angular/core';

import { WidgetModel, WSmileyModel } from '../../../models/models';
import { SurveyConfigService } from '../survey-config.service';

declare var $: any;

@Component({
    selector: 'widget-smiley-editor',
    templateUrl: './widget-smiley.component.html',
    styleUrls: ['./widget-smiley.component.css']
})

export class WidgetSmileyEditor
{

    @Input() modelInfo:WidgetModel ;

    model:WSmileyModel = null;

    data:SurveyConfigService = null ;

    constructor(private config: SurveyConfigService)
    {
        this.data = config;

        this.model.title = this.data.selectedWidget.content["title"];

    }

    deleteWidget()
    {
        this.data.removeWidget(this.modelInfo);
    }



    useSubtitles()
    {
        if(this.model.useSubtitles)
        {
            $('#subtitles-list').hide();
            this.model.useSubtitles = false ;
        }
        else
        {
            $('#subtitles-list').show();
            this.model.useSubtitles = true ;
        }
    }

    onSaveChanges()
    {
        
    }
}


