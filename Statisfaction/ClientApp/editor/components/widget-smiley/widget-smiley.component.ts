import { Component, Input} from '@angular/core';

import { WidgetBase, WSmileyModel } from '../../../models/models';
import { SurveyConfigService } from '../survey-config.service';

declare var $: any;

@Component({
    selector: 'widget-smiley-editor',
    templateUrl: './widget-smiley.component.html',
    styleUrls: ['./widget-smiley.component.css']
})

export class WidgetSmileyEditor
{

    widgetID:string = "1234";
    
    // ---------------------------

    @Input() modelInfo:WidgetBase ;

    model:WSmileyModel = null;

    data:SurveyConfigService = null ;

    constructor(private config: SurveyConfigService)
    {
        this.data = config;

        var modelAsString = this.data.selectedWidget.content;

        this.model = JSON.parse(modelAsString);
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


