import { Component, Input } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyConfigService } from '../survey-config.service';
import { GeneralModel } from '../../../models/models';

@Component({
    selector: 'editor-topbar',
    templateUrl: './editor-topbar.component.html',
    styleUrls: ['./editor-topbar.component.css'],
    providers:[SurveyConfigService]
})

export class EditorTopbarComponent 
{

    @Input() general:GeneralModel = null;

    state:number = 0 ;

    constructor(public sharedData: SurveyConfigService)
    {
        this.state = sharedData.state;
    }
}
