import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import { WSmileyModel } from '../../../models/models';
import { SurveyConfigService } from '../survey-config.service';

declare var $: any;

@Component({
    selector: 'widget-smiley-editor',
    templateUrl: './widget-smiley.component.html',
    styleUrls: ['./widget-smiley.component.css']
})

export class WidgetSmileyEditor implements OnChanges
{

    widgetID:string = "1234";
    
    // ---------------------------

    @Input() selectedIndex:number ;

    model:WSmileyModel = null;

    data:SurveyConfigService = null ;

    constructor(private config: SurveyConfigService)
    {
        this.data = config;
    
        this.model = config.getCurrentWidget() as WSmileyModel ;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.model = this.data.getCurrentWidget() as WSmileyModel ;

        console.log("ID",this.model.localID);
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

}


