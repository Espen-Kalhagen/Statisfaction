// Write your Javascript code.

"use strict";

var client;
var respList = [];
var delay= 10;

function start_rabbit(destQueueName) {

        // Stomp.js set up a connection
    if (location.search == '?ws') {
        client = Stomp.client('ws://' + "rabbitmq.statisfaction.tech" + ':15674/ws');
    } else { //legacy support
        var ws = new SockJS('http://' + "rabbitmq.statisfaction.tech" + ':15674/stomp');
        client = Stomp.over(ws);
    }

    var on_message = function (m){
        console.log("recived message: "+ m.body);
        if (m.body = "SurveyIDUpdate"){
            location.reload();
        }
        
    }
    var on_connect = function (m) {
        client.subscribe(destQueueName, on_message);
        console.log("Subscribed to " + destQueueName);
    }


    var on_error = function () {
        console.log('error');
    };
    //Connect localhost with username guest, password guest and callback function on_connect
    client.connect('unituser', 'unituser', on_connect, on_error, '/');
}


function send_wrapper(data) {
    client.send('testqueue', { "content-type": "text/plain" }, data);
}

