import { Component } from '@angular/core';

@Component({
    selector: 'widget-smiley',
    templateUrl: './smiley-widget.component.html',
    styleUrls: ["./smiley-widget.component.css"]
})

export class SmileyWidgetComponent 
{
    title:string = "Widget Title";
    selection:string;

    onSelect(option:string) : void
    {
        this.selection = option;
    }
}
