const http = require('http').createServer(handler)
const io = require('socket.io')(http)
const ioHook = require('iohook');
const hostname = '127.0.0.1'
const port = 8080
const filesystem = require("./paths.js")
var fs = require('fs');
var path = require('path');

var currentPageIndex = 0;
var rootpages = filesystem.getSubFiles("./public/websites")
var currentpages = rootpages
var pagehistory = []
var pagehistoryindex = []

http.listen(8080);

function handler(request, response) {
    if(request.url == "/app"){
        request.url = "/public/websites/start.html"
        response.url = "/public/websites/start.htmlc"
        serveFile(request,response)
    }else{
        serveFile(request,response)
    }
}

function serveFile(request, response){
    var filePath = '.' + request.url;
    var extname = path.extname(filePath);
    console.log(filePath);
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                response.writeHead(200);
                response.end("file not found", 'utf-8');
                console.log('file not found! ');
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
                console.log('error ' + error.code);
            }
        }
        else {
            var headers = {};
            headers["Access-Control-Allow-Origin"] = "*";
            headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
            headers["Access-Control-Allow-Credentials"] = false;
            headers["Access-Control-Max-Age"] = '86400'; // 24 hours
            headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
            //headers['Content-Type'] = contentType;
            response.writeHead(200, headers);
            response.end(content, 'arraybuffer');
        }
    });
}

const socket = io.sockets.on('connection', function (socket) {
    socket.on('reload', function (data) {
        console.log("reload reviced")
    });
});

ioHook.on("keydown", hook);
ioHook.start();

function hook(event) {
    console.log(event.keycode);
    if (event.keycode == 30) { // d key
        console.log("key d: right!");
        currentPageIndex++;
        if (currentPageIndex >= currentpages.length) {
            currentPageIndex = 0;
        }
        socket.emit('reload', currentpages[currentPageIndex].path)
    }

    if (event.keycode == 32) { // a key
        console.log("key a: left!");
        currentPageIndex--;
        if (currentPageIndex < 0) {
            currentPageIndex = currentpages.length - 1;
        }
        socket.emit('reload', currentpages[currentPageIndex].path);
    }
    if (event.keycode == 17) { // w key
        if (currentpages[currentPageIndex].subsites.length > 0) {
            pagehistory.push(currentpages)
            pagehistoryindex.push(currentPageIndex)
            currentpages = currentpages[currentPageIndex].subsites
            currentPageIndex = 0
            socket.emit('reload', currentpages[0].path);
        }
    }
    if (event.keycode == 31) { // s key
        if (pagehistory.length > 0) {
            currentpages = pagehistory.pop()
            currentPageIndex = pagehistoryindex.pop()
            socket.emit('reload', currentpages[currentPageIndex].path);
        }
    }
    if (event.keycode == 57) console.log("key space: play (currently not supported, TBD)");
}
