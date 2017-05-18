import { Directive, ViewContainerRef, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[chart-host]',
})
export class ChartDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}