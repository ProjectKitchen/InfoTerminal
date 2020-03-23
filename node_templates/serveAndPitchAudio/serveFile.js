
//
//  small file server for testing the pitching functionality
//
//  serves pitchaudio.html to be rendered in a webbrowser 
//     and the viper.mp3 (which is requested by pitchaudio)
//
//  listens on port 8080
//


var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    console.log('got request for ' + request.url);

    var filePath = '.' + request.url;

    var extname = path.extname(filePath);
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                response.writeHead(200);
                response.end("file not found", 'utf-8');
                console.log('file not found! ');
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
                console.log('error '+error.code);
            }
        }
        else {
              console.log('sending data');
              var headers = {};
              headers["Access-Control-Allow-Origin"] = "*";
              headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
              headers["Access-Control-Allow-Credentials"] = false;
              headers["Access-Control-Max-Age"] = '86400'; // 24 hours
              headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
              response.writeHead(200, headers);
//            response.writeHead(200, { 'Content-Type': contentType });
              response.end(content, 'arraybuffer');
        }
    });

}).listen(8080);
console.log('Server running at http://127.0.0.1:8080/');