import { Injectable } from '@angular/core';

declare var start_rabbit: any;
declare var send_wrapper: any;
declare var $:any;

@Injectable()
export class SendingService {

    private respList: Array<any>;
    private timer:number;
    private owner:any;
    private nextWidget:any;

    constructor(){
        this.respList = [];
    }

    public init(){
        start_rabbit();
    }

    public putRepsonse(owner:any, response:any,nextWidget:any): Promise<Boolean> {

        window.clearTimeout(this.timer);

        console.log("Added response: "+ JSON.stringify(response));
        this.respList.push(response);
        this.owner = owner;
        this.nextWidget = nextWidget;

        return new Promise(resolve => {
        this.timer = window.setTimeout(() => resolve(this.sendData(nextWidget)), 5000);
        });
  }
    //Only use on the last or only widget
  public sendNow(){
      window.clearTimeout(this.timer);
      this.sendData(this.nextWidget)
  }

  private sendData(nextWidget:any): Promise<Boolean>{

    //TODO: is just sending last response send all responses
    var result ={
        "Owner":this.owner,
        "responses":[]
    } 
    for (let entry of this.respList) {
     result.responses.push(entry)
    }
    send_wrapper(JSON.stringify(result));
    this.owner = null;
    this.respList=[];

    return  Promise.resolve(true);
  }


}

