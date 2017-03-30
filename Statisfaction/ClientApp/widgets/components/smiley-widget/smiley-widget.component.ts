import { Component } from '@angular/core';

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
    rabbitRunning:boolean = false;
    title:string = "Widget name";
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
        send_wrapper(smileyNr);
        }

    }

}




