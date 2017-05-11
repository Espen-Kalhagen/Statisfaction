
export class WidgetBaseModel {
    public localID: string;
    public type: string;
    constructor() { this.localID = UUID.newUUID(); }
}

export class WSmileyModel extends WidgetBaseModel {

    public title: string = "";

    public subtitle1: string = "";
    public subtitle2: string = "";
    public subtitle3: string = "";
    public subtitle4: string = "";

    //TODO:remove
    public LogoURL: string ="";
    public backgroundColor: string = "#D0DCE3";

    public useSubtitles: boolean = false;

    constructor() {
        super();
    }
}

export class GeneralModel {

    public title: string = "";

    public description: string = "";

<<<<<<< HEAD
    constructor() {

=======
    public color:string = "";

    public logoUrl:string = "";

    constructor() 
    {
        
>>>>>>> Added colorpicker and url input in general editor
    }
}

<<<<<<< HEAD
export class SurveyInfoModel {
    
    public title: string;
    public description: string;

    public created: Date;
    public updated: Date;

    public status:string;

}


=======
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
    ]

    //TODO:remove
    public LogoURL: string = "";
    public backgroundColor: string = "#D0DCE3";


    constructor() {
        super();
    }
}
>>>>>>> Changed question widget to use model, alos fixed a crusial sending bug in store widget

// Can be used to create a UUID
class UUID {
    static newUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
