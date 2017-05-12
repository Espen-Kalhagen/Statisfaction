
export class WidgetBaseModel
{
    public widgetID:string ;
    public type:string;
    constructor(){this.widgetID = UUID.newUUID();}
}

export class WSmileyModel extends WidgetBaseModel {

    public title: string = "";

    public subtitle1: string = "";
    public subtitle2: string = "";
    public subtitle3: string = "";
    public subtitle4: string = "";

    public useSubtitles: boolean = false;

    //Looks weird without colors, please don't remove
    public color:string;
    
    constructor() 
    {
        super();
    }
}

export class WThankYouModel
{
    public delay:number = 4;
    public message:string = "";
}

export class GeneralModel {

    public ownerID:string = "temp";

    public surveyID:string = "";

    public title: string = "";
    
    public description: string = "";

    public color:string = "";

    public logoUrl:string = "";

    public timeoutDelay:number = 8;

    constructor() 
    {
        if(this.surveyID == "")
        {
            this.surveyID = UUID.newUUID();
        }
    }
}

export class WQuestionModel extends WidgetBaseModel {

    public title: string = "";
    public questionID: string ="";

    public answerList: [
        {
            answerText: string;
            buttonColor:string;
            responseID:string;
            //man kan bare ignorere disse feltene og det går fint
            contentIMG:string;
            imgSize:number;
        }
    ];

    constructor() {
        super();
    }
}

export class SurveyModel
{
    constructor(public general:GeneralModel, public widgets:WidgetBaseModel[], public thankYou:WThankYouModel){}
}

// Can be used to create a UUID
class UUID {
    static newUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
