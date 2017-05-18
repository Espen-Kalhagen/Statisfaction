import { ChartsModule } from 'ng2-charts';
require("chart.js");
import { DataHandlerService } from './data-handler.service';
import { OnInit, Component, ComponentFactoryResolver, Type, ViewChild } from "@angular/core";
import { ChartContentComponent } from "./chart-content/chart-content.component";
import { ChartDirective } from "./chart.directive";



declare var $: any;

@Component({
  selector: 'my-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
  export class ChartComponent implements OnInit {
  @ViewChild(ChartDirective) chartHost: ChartDirective;
  public dateToday:Date;
  public unitData: any;
 
    constructor(
      private dataHandler: DataHandlerService,
      private componentFactoryResolver: ComponentFactoryResolver
      ) { }
 
   ngOnInit(): void {
    this.dateToday =new Date();
    this.dataHandler.getUnitData().then(unitData => this.unitData = unitData);

    }
    fetch(){
      this.loadComponent();
    }

    private loadComponent() {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChartContentComponent);
      let viewContainerRef = this.chartHost.viewContainerRef;
      viewContainerRef.clear()
      let componentRef = viewContainerRef.createComponent(componentFactory);


    }

  }