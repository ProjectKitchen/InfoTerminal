var express = require('express');
var app = express();
var ws = require('express-ws')(app);
var pagesystem = require('./paths.js')

var currentPageIndex = 0;
var rootpages = pagesystem.parseJson("./sitespaths.json")
var currentpages = rootpages
var pagehistory = []
var pagehistoryindex = []

app.use('/', express.static('../webpages'));
app.use('/', express.static('./client_script'));
app.use('/audio', express.static('../audio'));
app.use('/video', express.static('../video'));

var reloading = true;
var websocketReload;
var websocketMediaControl;

app.ws('/reload', function (ws, req) {
    websocketReload = ws;
    reloading = false;
    ws.on("close", (err, connection) => { reloading = true; })
});

var hasmedia = false;
var isplaying = false;
var mediainput = true;
app.ws('/media', function (ws, req) {
    websocketMediaControl = ws;
    mediainput = false;
    ws.on("close", (err, connection) => { mediainput = true; hasmedia = false })

    ws.on("message", (message) => {
        hasmedia = message;
    })
});

app.listen(8080, function () {
    console.log('App listening on port 8080!');
});

function playMedia() {
    if (hasmedia) {
        if (isplaying == false) {
            websocketMediaControl.send("do")
            isplaying = true
        } else {
            websocketMediaControl.send("do")
            isplaying = false
        }
    }
}

function pageChangeForward() {
    if (reloading == false) {
        reloading = true
        currentPageIndex++;
        if (currentPageIndex >= currentpages.length) {
            currentPageIndex = 0;
        }
        websocketReload.send('f' +currentpages[currentPageIndex].path)
    }
}

function pageChangeBackwards() {
    if (reloading == false) {
        reloading = true
        currentPageIndex--;
        if (currentPageIndex < 0) {
            currentPageIndex = currentpages.length - 1;
        }
        websocketReload.send('b' +currentpages[currentPageIndex].path)
        reloading = true
    }
}


function pageChangeEnter() {
    if (reloading == false) {
        if (currentpages[currentPageIndex].subsites.length > 0) {
            reloading = true
            pagehistory.push(currentpages)
            pagehistoryindex.push(currentPageIndex)
            currentpages = currentpages[currentPageIndex].subsites
            currentPageIndex = 0
            websocketReload.send('e' + currentpages[currentPageIndex].path)
            
        }
    }
}

function pageChangeExit() {
    if (reloading == false) {
        if (pagehistory.length > 0) {
            reloading = true
            currentpages = pagehistory.pop()
            currentPageIndex = pagehistoryindex.pop()
            websocketReload.send('x' + currentpages[currentPageIndex].path)
        }
    }
}

function goSleepMode() {
    if (reloading == false) {
        reloading = true
        websocketReload.send('x'+"start.html")
    }
}

const ioHook = require("iohook")
ioHook.on("keydown", hook);
ioHook.start();
function hook(event) {
    if (event.keycode == 32) { // d
        pageChangeForward()
    }
    if (event.keycode == 30) { // a
        pageChangeBackwards()
    }
    if (event.keycode == 17) { // w
        pageChangeEnter()
    }
    if (event.keycode == 31) { // s
        pageChangeExit()
    }
    if (event.keycode == 25) { // p
        playMedia()
    }
}
