import { Component, Input, Type, Output, EventEmitter } from '@angular/core';
import { SendingService } from "../../../store-unit/SendingService";
import { WidgetItem } from "../../widget-item";
import { WidgetComponent } from "../../widget.component";

declare var Stomp: any;
declare var $: any;
declare var send_data:any;
declare var all: any;
declare var start_rabbit: any;
declare var send_wrapper: any;


@Component({
    selector: 'widget-thanks',
    templateUrl: './thanks-widget.component.html',
    styleUrls: ["./thanks-widget.component.css"],
    providers: [SendingService],
    outputs: ['onAnswered'],
})


export class ThanksWidgetComponent implements WidgetComponent
{
    CookieContent: string;
    title:string = "Thanks ";
    selection:string; 
    surveyPart:any;
    onAnswered:EventEmitter<boolean>;

    constructor(private sendingService: SendingService ) { 

    }
    ngOnInit(){
        this.title = this.surveyPart.Title;
    setTimeout(() => {
      this.onAnswered.emit();
    }, this.surveyPart.Time);
    }



}




