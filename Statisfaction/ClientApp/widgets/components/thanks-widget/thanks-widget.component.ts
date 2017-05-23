import { Component, Input, Type, Output, EventEmitter } from '@angular/core';
import { SendingService } from "../../../store-unit/SendingService";
import { WidgetItem } from "../../widget-item";
import { WidgetComponent } from "../../widget.component";
import { WThankYouModel } from "../../../models/models";

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
    selection:string; 
    surveyPart:any;
    onAnswered:EventEmitter<boolean>;
    model: WThankYouModel;
    SurveyID: string;

    constructor(private sendingService: SendingService ) { 

    }
    ngOnInit(){
        this.model = this.surveyPart as WThankYouModel;
    setTimeout(() => {
      this.onAnswered.emit();
      console.log("thanks timeout: " + this.model.delay);
    }, this.model.delay*1000);
    }



}




