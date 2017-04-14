
import { EventEmitter } from "@angular/core";

export interface WidgetComponent {
    CookieContent: string;
    surveyPart:any;
    onAnswered:EventEmitter<boolean>;


}