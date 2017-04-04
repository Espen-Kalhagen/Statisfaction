// Write your Javascript code.

"use strict";

var client;


//Call 
$('#SendMessage').click(function () {
    send_data($('#first input').val());
});

function start_rabbit() {

        // Stomp.js set up a connection
    if (location.search == '?ws') {
        client = Stomp.client('ws://' + window.location.hostname + ':15674/ws');
    } else { //legacy support
        var ws = new SockJS('http://' + window.location.hostname + ':15674/stomp');
        client = Stomp.over(ws);
    }


    var on_connect = function (x) {
        //This is where you know the connection is up, and you can subscribe to posts if you want to
        console.log("Connected tp testqueue");
    };


    var on_error = function () {
        console.log('error');
    };
    //Connect localhost with username guest, password guest and callback function on_connect
    client.connect('guest', 'guest', on_connect, on_error, '/');
}


function send_wrapper(data) {
    client.send('testqueue', { "content-type": "text/plain" }, data);
}


