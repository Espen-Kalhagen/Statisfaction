import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SendingService } from "../../../store-unit/SendingService";
import { WidgetComponent } from "../../widget.component";

declare var $:any;

@Component({
    selector: 'widget-question',
    templateUrl: './question-widget.component.html',
    styleUrls: ["./question-widget.component.css"],
    providers: [SendingService]
})


export class QuestionWidgetComponent implements WidgetComponent
{
    CookieContent: string;
    rabbitRunning:boolean = false;
    title:string = "Help us improve";
    selection:string; 
    surveyPart:any;
    colsize:number;
    nrQuestionsAnswered:number = 0;
    private questionsAnswered: Array<boolean>;
    onAnswered:EventEmitter<boolean>;

    constructor(private sendingService: SendingService) { 
    }
        ngOnInit () {

            this.colsize = 12/this.surveyPart.Questions.length;
            this.questionsAnswered = [];

        }

    onSelect(option:string) : void
    {
        this.selection = option;
    }
    //Hide the buttons when answered
    public isAnswered(qID:number){
       return this.questionsAnswered[qID];
    }

    send( responseID, questionID){            
            // Retrieve the CookieData and parse it into a json-object 
            // We do this to be able to extract the data we need to save
            //Cookie content is injected by the store-unit 
            var cookieData = JSON.parse(this.CookieContent);

            // Creates a response-message with the required information
            var resp = 
            {
                    "widgetID" : 2,
                    "QuestionID": questionID, 
                    "responseID" : responseID
            };


            //Hide the buttons when answered
            this.questionsAnswered[questionID] = true;
            this.nrQuestionsAnswered++;
            
            // Send the data to the RabbitMQ Queue system
            this.sendingService.putRepsonse( cookieData["ownerID"],resp).then(result => this.resetView());
            
          //Move on to next widget if all questions answered
            if(this.surveyPart.Questions.length == this.nrQuestionsAnswered){
                this.onAnswered.emit(true);
            }
}
    //Reset the buttons when answer is sent
    private resetView(){

        //This might stop working
        for(let i =0; i < this.surveyPart.Questions.length; i++){
            this.questionsAnswered[this.surveyPart.Questions[i].QuestionID]=false;
        }
        this.nrQuestionsAnswered = 0;
        console.log("Reset view");
    }

}




