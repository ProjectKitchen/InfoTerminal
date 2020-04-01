const http = require('http').createServer(handler)
const io = require('socket.io')(http)
const ioHook = require('iohook');
const hostname = '127.0.0.1'
const port = 8080
const filesystem = require("./paths.js")
var fs = require('fs');
var path = require('path');

var currentPageIndex = 0;
console.log(filesystem)
var rootpages = filesystem.getSubFiles("./test")
var currentpages = rootpages
var headpages = []
var headpageindex = 0

http.listen(8080);

function handler(request, response) {
    console.log('got request for ' + request.url);
    var filePath = '.' + request.url;
    var extname = path.extname(filePath);
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
            console.log('sending data');
            var headers = {};
            headers["Access-Control-Allow-Origin"] = "*";
            headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
            headers["Access-Control-Allow-Credentials"] = false;
            headers["Access-Control-Max-Age"] = '86400'; // 24 hours
            headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
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

    if (event.keycode == 32) { // as key
        console.log("key a: left!");
        currentPageIndex--;
        if (currentPageIndex < 0) {
            currentPageIndex = currentpages.length - 1;
        }
        socket.emit('reload', currentpages[currentPageIndex].path);
    }

    if (event.keycode == 20) { // t key     enter page into subpages
        console.log("sub")
        if (currentpages[currentPageIndex].subsites.length > 0) {
            headpages = currentpages
            headpageindex = currentPageIndex
            currentpages = currentpages[currentPageIndex].subsites
            currentPageIndex = 0
            socket.emit('reload', currentpages[0].path);
        }
    }

    if (event.keycode == 44) { // z key     exit page into headpages
            currentpages = headpages
            currentPageIndex = headpageindex
            headpages = rootpages
            socket.emit('reload', currentpages[currentPageIndex].path);
}
    if (event.keycode == 17) console.log("key w: enter (currently not supported, TBD)");
    if (event.keycode == 31) console.log("key s: exit (currently not supported, TBD)");
    if (event.keycode == 57) console.log("key space: play (currently not supported, TBD)");
}
