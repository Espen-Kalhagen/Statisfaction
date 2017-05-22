import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { WSmileyModel } from '../../../models/models';
import { SurveyConfigService } from '../survey-config.service';

declare var $: any;

@Component({
    selector: 'widget-smiley-editor',
    templateUrl: './widget-smiley.component.html',
    styleUrls: ['./widget-smiley.component.css', '../../styles/forms.styles.css']
})

export class WidgetSmileyEditor implements OnChanges {

    widgetID: string = "1234";

    // ---------------------------

    @Input() selectedIndex: number;

    model: WSmileyModel = null;

    data: SurveyConfigService = null;

    constructor(private config: SurveyConfigService) {
        this.data = config;

        this.model = config.getCurrentWidget() as WSmileyModel;
    }

    ngOnChanges(changes: SimpleChanges) {

        this.model = this.data.getCurrentWidget() as WSmileyModel;
        this.checkSubtitles();
    }

    useSubtitles() {
        this.model.useSubtitles = !this.model.useSubtitles;
        console.log(this.model.useSubtitles);
        this.checkSubtitles();
    }

    checkSubtitles() {
        if (this.model.useSubtitles)
            $('#subtitles-list').show();
        else
            $('#subtitles-list').hide();
    }

}


