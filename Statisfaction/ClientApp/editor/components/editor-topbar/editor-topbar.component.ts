import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyConfigService } from '../survey-config.service';

@Component({
    selector: 'editor-topbar',
    templateUrl: './editor-topbar.component.html',
    styleUrls: ['./editor-topbar.component.css'],
    providers:[SurveyConfigService]
})

export class EditorTopbarComponent 
{

    constructor(public sharedData: SurveyConfigService)
    {

    }
}
