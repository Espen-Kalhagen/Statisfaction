import { ViewChild, Component, ElementRef, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
require("chart.js");
import { DataHandlerService } from './data-handler.service';

@Component({
    selector: 'my-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  // Doughnut
  public labels:string[] = ['Veldig Ufornøyd', 'Ikke fornøyd', 'Fornøyd', 'Veldig fornøyd'];
  public data:number[] = [1, 2, 3, 4];
  public chartType:string = 'doughnut';
  //public colors:string[] = ['#FFF','#111']

  constructor(private dataHandler:DataHandlerService) { }

  ngOnInit(): void {
    this.dataHandler.getData().then(data => this.data = data);
  }
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}