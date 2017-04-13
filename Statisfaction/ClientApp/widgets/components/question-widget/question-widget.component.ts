import { Component, Input } from '@angular/core';
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
    surveyPart:any ="";
    colsize:number;
    private questionsAnswered: Array<boolean>;

    constructor(private sendingService: SendingService) { 
    }


        ngOnInit () {
            //Dummy data
            this.surveyPart = {
                "Title":"What discribes this location",
                "LogoURL":"https://media.snl.no/system/images/18571/standard_uia.png",
                "BackgroundColor":"#D0DCE3",
                "widgetID":2,
                "Questions": [
                    {   
                        "QuestionID":1,
                        "QuestionTitle":"Look",
                        "AnswerList":
                        [
                            {"Content": "Tidy","ButtonColor":"#00759A","responseID":1 },
                            {"Content": "Normal","ButtonColor":"#A6BCC6","responseID":2 },
                            {"Content": "Messy","ButtonColor":"#C7B9AA","responseID":3 },
                            {"Content": "Disgusting", "ButtonColor":"#91785B","responseID":3 }                     
                        ]
                    },
                    {
                        "QuestionID":2,
                        "QuestionTitle":"Staff 👩‍💼",
                        "AnswerList":
                        [
                            {"Content": "Good","ContentIMG":"/images/smiley_1.png", "IMGSize":20, "ButtonColor":"#4CAF50","responseID":1 },
                            {"Content": "Acceptable","ContentIMG":"/images/smiley_2.png", "IMGSize":20, "ButtonColor":"#CDDC39","responseID":2 },
                            {"Content": "Bad","ContentIMG":"/images/smiley_4.png", "IMGSize":20, "ButtonColor":"#FF9800","responseID":3 }
                        ]
                    }
                        
                ]
            };

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
            
            // Send the data to the RabbitMQ Queue system
            this.sendingService.putRepsonse( cookieData["ownerID"],resp,"smiley-widget").then(result => this.resetView());
    }
    //Reset the buttons when answer is sent
    private resetView(){
        for(let i =0; i <= this.surveyPart.Questions.length; i++){
            this.questionsAnswered[i]=false;
        }
        console.log("Reset view");
    }

}




