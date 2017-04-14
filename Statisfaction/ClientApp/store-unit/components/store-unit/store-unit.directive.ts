import { Directive, ViewContainerRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[widget-host]',
})
export class WidgetDirective {
    @Output() onAnswered = new EventEmitter<boolean>();
  constructor(public viewContainerRef: ViewContainerRef) {
   }
}