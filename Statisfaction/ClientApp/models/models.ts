
export class WidgetBaseModel
{
    public localID:string ;
    public type:string;
    constructor(){this.localID = UUID.newUUID();}
}

export class WSmileyModel extends WidgetBaseModel {

    public title: string = "";

    public subtitle1: string = "";
    public subtitle2: string = "";
    public subtitle3: string = "";
    public subtitle4: string = "";

    public LogoURL: string ="";

    public backgroundColor: string = "#D0DCE3";

    public useSubtitles: boolean = false;
    
    constructor() 
    {
        super();
    }
}

export class GeneralModel {

    public title: string = "";
    
    public description: string = "";

    constructor() 
    {
        
    }
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
