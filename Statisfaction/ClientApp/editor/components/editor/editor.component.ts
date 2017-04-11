import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyConfigService } from '../survey-config.service';

@Component({
    selector: 'editor',
    templateUrl: './editor.component.html',
    providers:[SurveyConfigService]
})

export class EditorComponent 
{

}
