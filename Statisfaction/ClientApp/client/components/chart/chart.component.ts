import { ChartsModule } from 'ng2-charts';
require("chart.js");
import { DataHandlerService } from './data-handler.service';
import { OnInit, Component } from "@angular/core";


declare var $: any;

@Component({
  selector: 'my-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
  export class ChartComponent implements OnInit {
    public data: number[] = [1, 2, 3, 4];
    public chartType: string = 'doughnut';
    //public colors:string[] = ['#FFF','#111']
    public surveyData: any;
    public unitData: any;
    public chartData: Array < any > = [];
    public lineChartLabels: any[] = [];
    public lineChartColors: Array < any > = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';
    public donutChartlabels: any[] = [];
    public donutChartResponceCount: any[] = [];
 
    constructor(private dataHandler: DataHandlerService) { }
 
   ngOnInit(): void {
      this.dataHandler.getData().then(data => this.data = data);
      this.surveyData = this.dataHandler.getStatisticsResponces();
      this.dataHandler.getUnitData().then(data => this.unitData = data);
      console.log("creating chart data");

      for (let question of this.surveyData.questions) {
        let answers = [];
        let donutLabels = [];
        let donutResponses = [];
        for (let answer of question.answers) {
          let line = []
          let donutCount = 0;
          for (let countPerHour of answer.countPerHour) {
            line.push(countPerHour.count)
            donutCount += countPerHour.count;
          }
          answers.push({ data: line, label: answer.text })
          donutLabels.push(answer.text);
          donutResponses.push(donutCount);
        }
        this.chartData.push({ title: question.title, answers: answers });
        this.donutChartlabels.push(donutLabels);
        this.donutChartResponceCount.push(donutResponses);
      }
      console.log("Chart data:");
      console.log(this.chartData);
      let i = this.surveyData.summary.timeStart;
      while (i <= this.surveyData.summary.timeEnd) {
        this.lineChartLabels.push(i);
        i++;
      }

    }


   // events
  }