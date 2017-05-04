
export class WSmileyModel {
    public title: string = "";

    public subtitle1: string = "";
    public subtitle2: string = "";
    public subtitle3: string = "";
    public subtitle4: string = "";

    public useSubtitles: boolean = false;
    
    constructor() { }
}

// Represents a WidgetBase model
export class WidgetBase {

    public id: string;
    public content: string;
    public type: string;

    constructor(type: string, content: string) {
        this.id = UUID.newUUID();
        this.content = content;
        this.type = type;
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
