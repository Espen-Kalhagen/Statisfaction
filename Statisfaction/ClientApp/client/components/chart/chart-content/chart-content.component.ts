
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
    public summaryData:any;
    public surveyData: any;
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
        let nrOfDays = this.daysBetween(this.contentInfo.startDate, this.contentInfo.endDate);
        if(nrOfDays > 7){
            alert("The chart data only supports viewing time periods less than a week")
            nrOfDays = 7;
        }
        let endDate = this.contentInfo.endDate;
        var month = ("0" + endDate.getMonth()).slice(-2);
        while(nrOfDays >=0){
    
            let day = endDate.getDate() - nrOfDays;
            let dayMonth = day+"/"+month
            this.creatChartData(endDate.getFullYear()+"/"+month+"/"+day, this.contentInfo.unitID, dayMonth);
            nrOfDays--;
        }
       



    }

    creatChartData(date:string, unitID:string, dayMonth:string){
        this.surveyData = this.dataHandler.getStatisticsResponces();
        console.log("creating chart data");
        this.summaryData.nrOfResponses += this.surveyData.summary.nrOfResponses;
        if(this.summaryData.completePersentage == -1){
            this.summaryData.completePersentage = this.surveyData.summary.completePersentage;
            this.summaryData.completnessFactor = this.surveyData.summary.completnessFactor;
        }else{
            this.summaryData.completePersentage = (this.surveyData.summary.completePersentage+this.summaryData.completePersentage)/2;
            this.summaryData.completnessFactor = (this.surveyData.summary.completnessFactor+ this.summaryData.completnessFactor)/2;
        }
        

        let j =0;
        
        for (let question of this.surveyData.questions) {

            if(this.chartData[j]===undefined){
                this.chartData[j] = []
            }

            let donutLabels = [];
            let donutResponses = [];
            let i =0;
            for (let answer of question.answers) {
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
        let i = this.surveyData.summary.timeStart +1;
        this.lineChartLabels.push( dayMonth + " "+ this.surveyData.summary.timeStart);
        while (i <= this.surveyData.summary.timeEnd) {
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