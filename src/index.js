var filesystem = require('./paths.js')
var express = require('express');
var app = express();
var ws = require('express-ws')(app);

var currentPageIndex = 0;
var rootpages = filesystem.getSubFiles("../webpages/websites", "./websites")
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
        currentPageIndex--;
        if (currentPageIndex < 0) {
            currentPageIndex = currentpages.length - 1;
        }
        websocketReload.send(currentpages[currentPageIndex].path)
        reloading = true
    }
}

function pageChangeBackwards() {
    if (reloading == false) {
        currentPageIndex++;
        if (currentPageIndex >= currentpages.length) {
            currentPageIndex = 0;
        }
        websocketReload.send(currentpages[currentPageIndex].path)
        reloading = true
    }
}


function pageChangeEnter() {
    if (reloading == false) {
        if (currentpages[currentPageIndex].subsites.length > 0) {
            pagehistory.push(currentpages)
            pagehistoryindex.push(currentPageIndex)
            currentpages = currentpages[currentPageIndex].subsites
            currentPageIndex = 0
            websocketReload.send(currentpages[currentPageIndex].path)
            reloading = true
        }
    }
}

function pageChangeExit() {
    if (reloading == false) {
        if (pagehistory.length > 0) {
            currentpages = pagehistory.pop()
            currentPageIndex = pagehistoryindex.pop()
            websocketReload.send(currentpages[currentPageIndex].path)
            reloading = true
        }
    }
}

function goSleepMode() {
    if (reloading == false) {
        websocketReload.send("start.html")
    }
}

const ioHook = require("iohook")
ioHook.on("keydown", hook);
ioHook.start();
function hook(event) {
    if (event.keycode == 30) {
        pageChangeForward()
    }
    if (event.keycode == 32) {
        pageChangeBackwards()
    }
    if (event.keycode == 17) {
        pageChangeEnter()
    }
    if (event.keycode == 31) {
        pageChangeExit()
    }
    if (event.keycode == 25) {
        playMedia()
    }
}