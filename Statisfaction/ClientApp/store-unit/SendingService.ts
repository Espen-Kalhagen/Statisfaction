import { Injectable, Type } from '@angular/core';
import { QuestionWidgetComponent } from "../widgets/components/question-widget/question-widget.component";

declare var start_rabbit: any;
declare var send_wrapper: any;
declare var $:any;
declare var respList:any;
declare var delay: any;
declare var GSurveyID:any;
declare var GUnitID:any;


@Injectable()
export class SendingService {


    private timer:number;
    private owner:any;

    constructor(){
    }

    public init(unitID:any){
        start_rabbit("StoreUnitQueue:" + unitID);
        

    }

    public putRepsonse(SurveyID:string,owner:any, response:any,UnitID:any): Promise<Boolean> {
        GSurveyID = SurveyID;
        GUnitID = UnitID;
        window.clearTimeout(this.timer);
        respList.push(response);
        console.log("Added response: " + JSON.stringify(response) + "RespListlooks like this: " + JSON.stringify(respList));
        this.owner = owner;

        return new Promise(resolve => {
        this.timer = window.setTimeout(() => resolve(this.sendData(UnitID,SurveyID)), delay*1000);
        });
  }
    //Only use on the last or only widget
  public sendNow(SurveyID:any, UnitID:any){
      window.clearTimeout(this.timer);
      this.sendData(SurveyID,UnitID)
  }

  private sendData(UnitID:any, SurveyID:any ): Promise<Boolean>{

      if ("undefined" === typeof respList[0]){
        return Promise.resolve(true);
    }
      var time = new Date();
      
    var surveyResponse ={
        
        "UnitID": GUnitID,
        "SurveyID":GSurveyID,
        "Hours": time.getHours(),
        "Minutes": time.getMinutes(),
        "Seconds": time.getSeconds(),
        "Day":time.getDate(),
        "Month":time.getMonth(),
        "Year":time.getFullYear(),
        "responses":[]
    } 
    console.log(surveyResponse);
    for (let entry of respList) {
        surveyResponse.responses.push(entry)
    }
    var toSend = JSON.stringify(surveyResponse)
    send_wrapper(toSend);
    respList=[];
    return  Promise.resolve(true);
  }

}
