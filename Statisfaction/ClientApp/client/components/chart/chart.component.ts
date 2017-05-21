import { ChartsModule } from 'ng2-charts';
require("chart.js");
import { DataHandlerService } from './data-handler.service';
import { OnInit, Component, ComponentFactoryResolver, Type, ViewChild, HostListener } from "@angular/core";
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
  public dateTo:Date;
  public dateFrom: Date;
  public unitData: any;
 
    constructor(
      private dataHandler: DataHandlerService,
      private componentFactoryResolver: ComponentFactoryResolver
      ) { }
 
   ngOnInit(): void {
    this.dateTo =new Date();
    this.dateFrom = new Date();
    this.dataHandler.getUnitData().then(unitData => this.unitData = unitData);

    }
    fetch(){
      this.loadComponent();
    }

    private loadComponent() {

      let contentInfo = new ContentInfo($("#selectbasic").val(), this.dateFrom, this.dateTo );
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChartContentComponent);
      let viewContainerRef = this.chartHost.viewContainerRef;
      viewContainerRef.clear()
      let componentRef = viewContainerRef.createComponent(componentFactory);
      componentRef.instance.contentInfo = contentInfo;


    }

  }

  export class ContentInfo{
    constructor (
      public unitID:any,
      public startDate:any,
      public endDate:any
    ){}
  }