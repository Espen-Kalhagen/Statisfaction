
import { Component, Input, Type, Output, EventEmitter } from '@angular/core';
import { SendingService } from "../../../store-unit/SendingService";
import { WidgetItem } from "../../widget-item";
import { WidgetComponent } from "../../widget.component";
import { WSmileyModel } from '../../../models/models';

declare var Stomp: any;
declare var $: any;
declare var send_data:any;
declare var all: any;
declare var start_rabbit: any;
declare var send_wrapper: any;


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
    @Input() model: WSmileyModel;

    constructor(private sendingService: SendingService ) { 
    }

    onSelect(option:string) : void
    {
        this.selection = option;
    }

    send(smileyNr){

            // Retrieve the CookieData and parse it into a json-object 
            // We do this to be able to extract the data we need to save
            //Cookie content is injected by the store-unit 
            var cookieData = JSON.parse(this.CookieContent);

            // Creates a response-message with the required information
            var resp = 
            {
                    "widgetID" : 1, 
                    "response" : smileyNr
            };

            // Turn the respons into a string (in order to send it)
            this.sendingService.putRepsonse( cookieData["ownerID"],resp).then();
            //Tells storeunit component to move on to next question in survey
            this.onAnswered.emit();
    }

}






