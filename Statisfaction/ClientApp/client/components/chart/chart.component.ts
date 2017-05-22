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

      let surveyData = [];
      let contentInfo = new ContentInfo($("#selectbasic").val(), this.dateFrom, this.dateTo );

      let nrOfDays = this.daysBetween(contentInfo.startDate, contentInfo.endDate);
      if(nrOfDays > 7){
          alert("The chart data only supports viewing time periods less than a week")
          nrOfDays = 7;
      }
      let endDate = contentInfo.endDate;
      var month = ("0" + endDate.getMonth()).slice(-2);
      while(nrOfDays >=0){
  
          let day = endDate.getDate() - nrOfDays;
          let dayMonth = day+"/"+month;
          console.log(endDate.getFullYear()+"/"+month+"/"+day +" UnitID;"+ contentInfo.unitID)
          this.dataHandler.getStatisticsResponces(endDate.getFullYear()+"/"+month+"/"+day, contentInfo.unitID).then(
              data =>{
                console.log(dayMonth);
                surveyData.push({statistics:data,dayMonth:dayMonth});

                if(nrOfDays==-1){
                        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChartContentComponent);
                        let viewContainerRef = this.chartHost.viewContainerRef;
                        viewContainerRef.clear()
                        let componentRef = viewContainerRef.createComponent(componentFactory);
                        componentRef.instance.contentInfo = contentInfo;
                        componentRef.instance.surveyData = surveyData;
                }

              });
            
            
            nrOfDays--;
        }

    }

          daysBetween(date1, date2) {

        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime()
        var date2_ms = date2.getTime()

        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms)

        // Convert back to days and return
        return Math.round(difference_ms / ONE_DAY)

    }

  }

  export class ContentInfo{
    constructor (
      public unitID:any,
      public startDate:any,
      public endDate:any
    ){}
  }

