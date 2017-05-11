import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyConfigService } from '../survey-config.service';

@Component({
    selector: 'editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css'],
    providers:[SurveyConfigService]
})

export class EditorComponent 
{

    constructor(public sharedData: SurveyConfigService)
    {

    }
}
