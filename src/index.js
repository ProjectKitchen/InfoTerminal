var express = require('express');
var app = express();
var ws = require('express-ws')(app);
var pagesystem = require('./paths.js')

var soundplaying = require('./soundplaying.js')

var currentPageIndex = 0;
var rootpages = pagesystem.parseJson("./sitespaths.json")
var currentpages = rootpages
var pagehistory = []
var pagehistoryindex = []

app.use('/', express.static('../webpages'));
app.use('/', express.static('./client_script'));
app.use('/audio', express.static('../audio'));
app.use('/video', express.static('../video'));

var idlemode = true
var websocketStartup = undefined
var reloading = true
var websocketReload
var websocketMediaControl

// 10 min is 600000 ms
// 5 s in 600000 ms
var timer = undefined
var sleepModeTime = 600000

app.ws('/reload', function (ws, req) {
    websocketReload = ws;
    if (idlemode == true) {
        reloading = true;
        websocketReload.send("s/")
    }
    let subsites = false
    let parentSides = false
    if (pagehistory.length > 0) {
        parentSides = true
    }
    if (currentpages[currentPageIndex].subsites.length > 0) {
        subsites = true
    }
    //enterButtonStatus(subsites)
    //exitButtonStatus(parentSides)
    
    reloading = false
    if (timer == undefined) { timer = setTimeout(function () { goSleepMode() }, sleepModeTime) }
    ws.on("close", (error, connection) => { reloading = true; })
});


var hasmedia = false;
var isplaying = false;
var mediainput = true;
app.ws('/media', function (ws, req) {
    websocketMediaControl = ws;
    mediainput = false;
    ws.on("close", (err, connection) => { mediainput = true; hasmedia = false })
    ws.on("message", (message) => {
        let status = false
        if (message == "true") { status = true }
        hasmedia = status;
        //mediaButtonStatus(status)
    })
});

app.ws('/startup', function (ws, req) {
    websocketStartup = ws;
    ws.on("close", (err, connection) => { websocketStartup = undefined })
    ws.on("message", (message) => {
        if (message == "start") {
            idlemode = false
        }
    })
});

function handleCordInput(data) {
    if (websocketStartup != undefined) {
        websocketStartup.send(data)
    }
}

var port = 8080
const server = app.listen(port, function () {
    console.log('App listening on port ' + port + '!');
});

function playMedia() {
    if (hasmedia == true) {
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
        timer.refresh()
        currentPageIndex++;
        if (currentPageIndex >= currentpages.length) {
            currentPageIndex = 0;
        }
        soundplaying.playSound("../audio/next.wav")
        websocketReload.send(currentpages[currentPageIndex].path)
    }
}

function pageChangeBackwards() {
    if (reloading == false) {
        reloading = true
        timer.refresh()
        currentPageIndex--;
        if (currentPageIndex < 0) {
            currentPageIndex = currentpages.length - 1;
        }
        soundplaying.playSound("../audio/prev.wav")
        websocketReload.send(currentpages[currentPageIndex].path)
    }
}

function pageChangeEnter() {
    if (reloading == false) {
        if (currentpages[currentPageIndex].subsites.length > 0) {
            reloading = true
            timer.refresh()
            pagehistory.push(currentpages)
            pagehistoryindex.push(currentPageIndex)
            currentpages = currentpages[currentPageIndex].subsites
            currentPageIndex = 0
            soundplaying.playSound("../audio/enter.wav")
            websocketReload.send(currentpages[currentPageIndex].path)

        }
    }
}

function pageChangeExit() {
    if (reloading == false) {
        if (pagehistory.length > 0) {
            reloading = true
            timer.refresh()
            currentpages = pagehistory.pop()
            currentPageIndex = pagehistoryindex.pop()
            soundplaying.playSound("../audio/exit.wav")
            websocketReload.send(currentpages[currentPageIndex].path)
        }
    }
}

function goSleepMode() {
    if (reloading == false) {
        reloading = true
        clearTimeout(timer)
        timer = undefined
        idlemode = true
        soundplaying.playSound("../audio/exit.wav")
        websocketReload.send("/websites/01_robox.html")
    }
}


/*
const buttons = require('./button_led.js')

function enterButtonStatus(status){
    if(status === true){
        if (buttons.Yellowled.readSync() === 0){
        buttons.Yellowled.writeSync(1);
        }
    }else{
        buttons.Yellowled.writeSync(0);
    }
}

function exitButtonStatus(status){
    if(status === true){
         if (buttons.Redled.readSync() === 0){
        buttons.Redled.writeSync(1);}
    }else{
        buttons.Redled.writeSync(0);
    }
}

function mediaButtonStatus(status){
    if(status === true){
        if (buttons.Greenled.readSync() === 0){
        buttons.Greenled.writeSync(1);}
    }else{
        buttons.Greenled.writeSync(0);
    }
}

buttons.Enterbutton.watch(function (err, value) { 
  if (err) { 
    console.error('There was an error', err); 
  return;
  }
   pageChangeEnter();
  
});

buttons.Exitbutton.watch(function (err, value) { 
  if (err) { 
    console.error('There was an error', err); 
  return;
  }
   pageChangeExit();
  
});

buttons.Playbutton.watch(function (err, value) { 
  if (err) { 
    console.error('There was an error', err); 
  return;
  }
   playMedia();
});

var crank = require('./crankshaft.js')
crank.Crankshaftevent.on('event',function(speed){
if(idlemode == false){
    if (speed > 10)  {pageChangeForward(); }
   else if(speed < -10){
     pageChangeBackwards();}
    }else {
        handleCordInput(speed)
        }

});


process.on('SIGINT',  (signal) => {
    buttons.Playbutton.unexport()
    buttons.Enterbutton.unexport()
    buttons.Exitbutton.unexport()
    buttons.Greenled.unexport()
    buttons.Yellowled.unexport()
    buttons.Redled.unexport()
        server.close(() => {
        console.log('Closed out remaining connections');
    })
     process.exit(0)
  });
  */


const ioHook = require("iohook")
ioHook.on("keydown", hook);
ioHook.start();
function hook(event) {
    if (event.keycode == 6) { // d
        pageChangeForward()
    }
    if (event.keycode == 7) { // a
        pageChangeBackwards()
    }
    if (event.keycode == 8) { // w
        pageChangeEnter()
    }
    if (event.keycode == 9) { // s
        pageChangeExit()
    }
    if (event.keycode == 10) { // p
        playMedia()
    }
    if (event.keycode == 11) { // k
        handleCordInput(1000)
    }
}
