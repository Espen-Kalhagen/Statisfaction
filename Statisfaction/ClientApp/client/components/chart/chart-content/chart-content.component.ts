
import { Component, Input } from "@angular/core";
import { DataHandlerService } from "../data-handler.service";
import { ContentInfo } from "../chart.component";

@Component({
    selector: 'chart-content',
    templateUrl: './chart-content.component.html',
    styleUrls: ["./chart-content.component.css"],
})


export class ChartContentComponent {
    
    @Input() contentInfo: ContentInfo;
    @Input() surveyData: any[];
    public summaryData:any;
    public chartType: string = 'doughnut';
    //public colors:string[] = ['#FFF','#111']
    public chartData: Array<any> = [];
    public lineChartLabels: any[] = [];
    public lineChartColors: Array<any> = [
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

    constructor(
        private dataHandler: DataHandlerService
    ) { }

    ngOnInit() {
        this.chartData = [];
        this.summaryData = { nrOfResponses:0 , completePersentage:-1, completnessFactor: -1};
                    console.log("creating chart with " );
            console.log(this.surveyData);
        for(let surveyData of this.surveyData){

            this.creatChartData(this.contentInfo.unitID, surveyData.dayMonth, surveyData.statistics);
        }
       



    }

    creatChartData( unitID:string, dayMonth:string, surveyData:any){
        console.log("creating chart data");

            
            this.summaryData.nrOfResponses += surveyData.summary.nrOfResponses;
            if(this.summaryData.completePersentage == -1){
                this.summaryData.completePersentage = surveyData.summary.completePercentage;
                this.summaryData.completnessFactor = surveyData.summary.completenessFactor;
            }else{
                this.summaryData.completePersentage = (surveyData.summary.completePercentage+this.summaryData.completePersentage)/2;
                this.summaryData.completnessFactor = (surveyData.summary.completenessFactor+ this.summaryData.completnessFactor)/2;
            }
            

            let j =0;
            
            for (let question of surveyData.questions) {

                if(this.chartData[j]===undefined){
                    this.chartData[j] = []
                }

                let donutLabels = [];
                let donutResponses = [];
                let i =0;
                for (let answer of question.answerList) {
                    let line = []
                    let donutCount = 0;
                    for (let countPerHour of answer.countPerHour) {
                        line.push(countPerHour.count)
                        donutCount += countPerHour.count;
                    }
                    if (this.chartData[j][i] === undefined) {
                        this.chartData[j][i] = { data: line, label: answer.text }
                    }
                    else {
                        this.chartData[j][i].data = this.chartData[j][i].data.concat(line);
                        
                    }
                    donutLabels.push(answer.text);
                    donutResponses.push(donutCount);
                    i++;
                }


                this.donutChartlabels.push(donutLabels);
                if(this.donutChartResponceCount[j] === undefined){
                    this.donutChartResponceCount[j] = donutResponses;
                }else{
                    for(let i =0; i < donutResponses.length; i++){
                        this.donutChartResponceCount[j][i] += donutResponses[i];
                    }
                }
                
                j++;
            }
            console.log("Chart data:");
            console.log(this.chartData);
            let i = this.contentInfo.fromTime.getHours() +1;
            this.lineChartLabels.push( dayMonth + " "+ this.contentInfo.fromTime.getHours());
            while (i <= this.contentInfo.toTime.getHours()) {
                this.lineChartLabels.push(i);
                i++;
            }
    }
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }
}