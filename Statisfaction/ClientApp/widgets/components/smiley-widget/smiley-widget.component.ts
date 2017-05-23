
import { Component, Input, Type, Output, EventEmitter } from '@angular/core';
import { SendingService } from "../../../store-unit/SendingService";
import { WidgetItem } from "../../widget-item";
import { WidgetComponent } from "../../widget.component";
import { WSmileyModel } from '../../../models/models';




@Component({
    selector: 'widget-smiley',
    templateUrl: './smiley-widget.component.html',
    styleUrls: ["./smiley-widget.component.css"],
    providers: [SendingService],
    outputs: ['onAnswered'],
})


export class SmileyWidgetComponent implements WidgetComponent
{
    CookieContent: string;
    title:string = "Widget name";
    selection:string; 
    surveyPart:any;
    onAnswered:EventEmitter<boolean>;
    SurveyID: string;
    @Input() model: WSmileyModel;
    

    constructor(private sendingService: SendingService ) { 
    }
    
    ngOnInit(){
        
        if(this.model == null){
            this.model = this.surveyPart as WSmileyModel;
        }

    }

    onSelect(option:string) : void
    {
        this.selection = option;
    }

    send(smileyNr, widgetID){

            // Retrieve the CookieData and parse it into a json-object 
            // We do this to be able to extract the data we need to save
            //Cookie content is injected by the store-unit 
            var cookieData = JSON.parse(this.CookieContent);

            // Creates a response-message with the required information
            let smNr:string = smileyNr+"";
            var resp = 
            {
                    "widgetTypeID" : "1", 
                    "widgetID": widgetID,
                    "responseID" : smNr
            };

            // Turn the respons into a string (in order to send it)
            this.sendingService.putRepsonse( this.SurveyID, cookieData["ownerID"],resp).then();
            //Tells storeunit component to move on to next question in survey
            this.onAnswered.emit();
    }

}






