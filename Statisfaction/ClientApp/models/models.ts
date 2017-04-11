
export class WSmileyModel {

    constructor
        (
        public title: string,
        public subtitles: string[],
        public useSubtitles: boolean,
        ) { }


}

// Represents a WidgetModel
export class WidgetModel {

    public id: string;
    public content: string;
    public type: string;
    
    //Probably not store icon path in the model
    public icon:string;

    constructor(type: string, content: string, icon="widget_default") {
        this.id = UUID.newUUID();
        this.content = content;
        this.type = type;
        this.icon = icon;
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
