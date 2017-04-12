import { Component, Input } from '@angular/core';

import { SendingService } from "../../../store-unit/SendingService";

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
    providers: [SendingService]
})


export class SmileyWidgetComponent 
{
    @Input() CookieContet: string;
    title:string = "Widget name";
    selection:string; 

    constructor(private sendingService: SendingService) { 
    }

    onSelect(option:string) : void
    {
        this.selection = option;
    }

    send(smileyNr){

            // Retrieve the CookieData and parse it into a json-object 
            // We do this to be able to extract the data we need to save
            var cookieData = JSON.parse(this.CookieContet);

            // Creates a response-message with the required information
            var resp = 
            {
                    "widgetID" : 1, 
                    "response" : smileyNr
            };

            // Turn the respons into a string (in order to send it)
            this.sendingService.putRepsonse( cookieData["ownerID"],resp,null).then();
            //Only use if this is the last or only widget
            this.sendingService.sendNow();
        

    }

}






