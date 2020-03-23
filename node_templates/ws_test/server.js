"use strict";  // http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

var webSocketsServerPort = 1337;   // Port where we'll run the websocket server

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var clients = [ ];

var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

    // This callback function is called every time someone
    // tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin); 
    // remember client and index 
    var index = clients.push(connection) - 1;
    var count=0
    console.log((new Date()) + ' Connection accepted from '+request.origin);
    connection.sendUTF(" hello from server! "); 
    
    setInterval(function() {
        count++;
        connection.sendUTF(" serverMsg"+count+" "); 
        }, 3000);
    

    // user sent some message
    connection.on('message', function(message) {
        console.log("message received, type=" +message.type+" data="+message.utf8Data);     
    });

    // user disconnected
    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
        // remove from list of connected clients
        clients.splice(index, 1);
    });
});