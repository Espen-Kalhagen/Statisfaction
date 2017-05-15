import { Injectable, Type } from '@angular/core';
import { QuestionWidgetComponent } from "../widgets/components/question-widget/question-widget.component";

declare var start_rabbit: any;
declare var send_wrapper: any;
declare var $:any;
declare var respList:any;
declare var delay: any;


@Injectable()
export class SendingService {


    private timer:number;
    private owner:any;
    private randNumber:number;

    constructor(){
    }

    public init(unitID:any){
        start_rabbit("StoreUnitQueue:" + unitID);
        

    }

    public putRepsonse(owner:any, response:any): Promise<Boolean> {
        this.randNumber = this.randNumber;
        window.clearTimeout(this.timer);
        respList.push(response);
        console.log("Added response: " + JSON.stringify(response) + "RespListlooks like this: " + JSON.stringify(respList));
        this.owner = owner;

        return new Promise(resolve => {
        this.timer = window.setTimeout(() => resolve(this.sendData()), delay*1000);
        });
  }
    //Only use on the last or only widget
  public sendNow(){
      window.clearTimeout(this.timer);
      this.sendData()
  }

  private sendData( ): Promise<Boolean>{

      if ("undefined" === typeof respList[0]){
        return Promise.resolve(true);
    }
      var time = new Date();
    var result ={
        
        "Owner":this.owner,
        "Hours": time.getHours,
        "Minutes": time.getMinutes,
        "Seconds": time.getSeconds,
        "Day":time.getDate,
        "Month":time.getMonth,
        "Year":time.getFullYear,
        "responses":[]
    } 
    for (let entry of respList) {
     result.responses.push(entry)
    }
    send_wrapper(JSON.stringify(result));
    respList=[];
    return  Promise.resolve(true);
  }

}
