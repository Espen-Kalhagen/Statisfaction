import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SendingService } from "../../../store-unit/SendingService";
import { WidgetComponent } from "../../widget.component";
import { WQuestionModel } from "../../../models/models";


@Component({
    selector: 'widget-question',
    templateUrl: './question-widget.component.html',
    styleUrls: ["./question-widget.component.css"],
    providers: [SendingService]
})


export class QuestionWidgetComponent implements WidgetComponent {
    CookieContent: string;
    rabbitRunning: boolean = false;
    selection: string;
    surveyPart: any;
    onAnswered: EventEmitter<boolean>;

    @Input() model: WQuestionModel;

    constructor(private sendingService: SendingService) 
    {
    }

    ngOnInit() {
        if (this.model == null) {
            this.model = this.surveyPart as WQuestionModel;
        }

    }

    onSelect(option: string): void {
        this.selection = option;
    }

    send(responseID, widgetID) {
        // Retrieve the CookieData and parse it into a json-object 
        // We do this to be able to extract the data we need to save
        //Cookie content is injected by the store-unit 
        var cookieData = JSON.parse(this.CookieContent);

        // Creates a response-message with the required information
        let resID:string = responseID+"";
        var resp =
            {
                "widgetTypeID": "2",
                "widgetID": widgetID,
                "responseID": resID
            };


        // Send the data to the RabbitMQ Queue system
        this.sendingService.putRepsonse(cookieData["surveyID"], cookieData["ownerID"], resp).then(result => console.log());

        //Move on to next widget if all questions answered
        this.onAnswered.emit(true);
    }

}




