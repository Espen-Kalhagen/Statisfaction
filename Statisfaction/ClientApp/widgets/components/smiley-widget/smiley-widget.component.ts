import { Component, Input } from '@angular/core';
import { WSmileyModel } from '../../../models/smiley-widget.model';

declare var Stomp: any;
declare var $: any;
declare var send_data:any;
declare var all: any;
declare var start_rabbit: any;
declare var send_wrapper: any;


@Component({
    selector: 'widget-smiley',
    templateUrl: './smiley-widget.component.html',
    styleUrls: ["./smiley-widget.component.css"]
})


export class SmileyWidgetComponent 
{
    @Input() CookieContet: string;
    rabbitRunning:boolean = false;

    @Input() model:WSmileyModel;

    constructor()
    {
        
    }

    selection:string; 

    onSelect(option:string) : void
    {
        this.selection = option;
    }

    send(smileyNr){
        if (!this.rabbitRunning){
            start_rabbit();
            this.rabbitRunning=true;
        }else{
            
            // Retrieve the CookieData and parse it into a json-object 
            // We do this to be able to extract the data we need to save
            var cookieData = JSON.parse(this.CookieContet);

            // Creates a response-message with the required information
            var resp = 
            {
                "ownerID" : cookieData["ownerID"],
                "responses" : 
                [
                    {"widgetID" : "1", "response" : smileyNr}
                ]
            };

            // Turn the respons into a string (in order to send it)
            var json = JSON.stringify(resp)
            
            // Send the data to the RabbitMQ Queue system
            send_wrapper(json);
        }

    }

}






