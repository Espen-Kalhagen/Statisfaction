import { Component, Input } from '@angular/core';

declare var Stomp: any;
declare var $: any;
declare var send_data:any;
declare var all: any;
declare var start_rabbit: any;
declare var send_wrapper: any;


@Component({
    selector: 'widget-question',
    templateUrl: './question-widget.component.html',
    styleUrls: ["./question-widget.component.css"]
})


export class QuestionWidgetComponent 
{
    @Input() CookieContet: string;
    rabbitRunning:boolean = false;
    title:string = "Help us improve";
    selection:string; 
    surveyPart:any ="";
    colsize:number;
        ngOnInit () {
            this.surveyPart = {
                "Title":"What discribes this store",
                "LogoURL":"https://media.snl.no/system/images/18571/standard_uia.png",
                "BackgroundColor":"#E8E8E8",
                "widgetID":"2",
                "Questions": [
                    {   
                        "QuestionID":1,
                        "QuestionTitle":"Look 👁",
                        "AnswerList":
                        [
                            {"Content": "Tidy","ContentIMG":"/images/smiley_1.png", "IMGSize":20,"ButtonColor":"#00ff00","ResponceID":1 },
                            {"Content": "Normal","ContentIMG":"/images/smiley_2.png", "IMGSize":20,"ButtonColor":"#ffff00","ResponceID":2 },
                            {"Content": "Messy","ContentIMG":"/images/smiley_3.png", "IMGSize":20,"ButtonColor":"#ff8800","ResponceID":3 },
                            {"Content": "Disgusting","ContentIMG":"/images/smiley_4.png", "IMGSize":20, "ButtonColor":"#ff0000","ResponceID":3 }
                        ]
                    },
                    {
                        "QuestionID":2,
                        "QuestionTitle":"Staff 👩‍💼",
                        "AnswerList":
                        [
                            {"Content": "Good", "ButtonColor":"#00ff00","ResponceID":1 },
                            {"Content": "Acceptable", "ButtonColor":"#ffff00","ResponceID":2 },
                            {"Content": "Bad", "ButtonColor":"#ff0000","ResponceID":3 }
                        ]
                    }
                        
                ]
            };
            this.colsize = 12/this.surveyPart.Questions.length;
            

        }

    onSelect(option:string) : void
    {
        this.selection = option;
    }

    send( responceID, questionID){
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
                    {"widgetID" : "2","QuestionID": questionID, "ResponceID" : responceID}
                ]
            };

            // Turn the respons into a string (in order to send it)
            var json = JSON.stringify(resp)
            
            // Send the data to the RabbitMQ Queue system
            send_wrapper(json);
        }

    }

}




