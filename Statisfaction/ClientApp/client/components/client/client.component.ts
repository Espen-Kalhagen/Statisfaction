import { Component } from '@angular/core';
import {SurveyDataService} from '../survey-data.service';

@Component({
    selector: 'client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css'],
    providers: [SurveyDataService]
})
export class ClientComponent 
{
    
}
