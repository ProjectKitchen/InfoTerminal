var express = require('express');
var app = express();
var ws = require('express-ws')(app);
var pagesystem = require('./paths.js')

const buttons = require('./button_led.js')

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
var nixieNumber=0
var actTimeNumber=0

// 10 min is 600000 ms
var timer = undefined
var sleepModeTime = 9300000
//Testing
//var sleepModeTime = 10000

var nixie = require('./nixie.js')

app.ws('/reload', function (ws, req) {
    console.log (ws);
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
    enterButtonStatus(subsites)
    exitButtonStatus(parentSides)
    nixieNumber = currentpages[currentPageIndex].nixitubes
    if (nixieNumber > 0) {
        nixie.setNixieNumber(nixieNumber);
        actTimeNumber=0;
    }
    reloading = false
    if (timer == undefined) { timer = setTimeout(function () { goSleepMode() }, sleepModeTime) }
    heartBeatTimer = setInterval(function () { sendHeartbeat() }, 1000) 
    ws.on("close", (error, connection) => { console.log ("WSReload closed");clearInterval(heartBeatTimer); reloading = true; })
});


var hasmedia = false;
var isplaying = false;
var mediainput = true;
app.ws('/media', function (ws, req) {
    websocketMediaControl = ws;
    mediainput = false;
    ws.on("close", (err, connection) => { 
        mediainput = true; 
        hasmedia = false;
        isplaying = false;}
        )
    ws.on("message", (message) => {
        let status = false
        if (message == "true") { status = true }
        hasmedia = status;
        mediaButtonStatus(status)
    })
});

var heartBeatTimerStartup
app.ws('/startup', function (ws, req) {
    websocketStartup = ws;
    ws.on("close", (err, connection) => { websocketStartup = undefined; clearInterval(heartBeatTimerStartup) })
    ws.on("message", (message) => {
        if (message == "start") {
            idlemode = false
        }
    })
    heartBeatTimerStartup = setInterval(function () { sendHeartbeatStartup() }, 1000) 
    buttons.Redled.writeSync(1);
        buttons.Yellowled.writeSync(1);
        buttons.Greenled.writeSync(1);
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

var blinkInterval = undefined
function playMedia() {
    if (hasmedia == true) {
        if (isplaying === false) {
            isplaying = true
            websocketMediaControl.send("true")
            buttons.Redled.writeSync(1);
            buttons.Greenled.writeSync(1);
            
            blinkInterval = setInterval(function(){
                if (buttons.Yellowled.readSync() === 0) { //check the pin state, if the state is 0 (or off)
                buttons.Yellowled.writeSync(1); //set pin state to 1 (turn LED on)
              } else {
                buttons.Yellowled.writeSync(0); //set pin state to 0 (turn LED off)
              }
                }, 250);
            soundplaying.playSound("../audio/enter.wav")
        } else {
            isplaying = false
            websocketMediaControl.send("false")
            clearInterval(blinkInterval); // Stop blink intervals
            buttons.Yellowled.writeSync(0);
            if (currentpages[currentPageIndex].subsites.length > 0) {
                 buttons.Greenled.writeSync(0);
                }
                if (pagehistory.length > 0) {
                    buttons.Redled.writeSync(0);
                    }
                     soundplaying.playSound("../audio/exit.wav")
        }
    }
}

function pageChangeForward() {
    if (reloading == false && isplaying === false) {
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
    if (reloading == false && isplaying === false) {
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
    if (reloading == false && isplaying === false) {
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
    if (reloading == false && isplaying === false) {
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

var seconds=0

function sendHeartbeat() {
    try {
        websocketReload.send("*/");
        var date=new Date();
        seconds = (seconds +1) % 10
        
        if ((nixieNumber==0) && (seconds==0)) {
           actTimeNumber= date.getHours()*100+date.getMinutes();
           nixie.setNixieNumber(actTimeNumber);
       }
    }
    catch (error) {
        console.log(error);
    }
}

function sendHeartbeatStartup() {
    try {
        websocketStartup.send("*/");
        var date=new Date();
        seconds = (seconds +1) % 10
        
        if ((nixieNumber==0) && (seconds==0)) {
           actTimeNumber= date.getHours()*100+date.getMinutes();
           nixie.setNixieNumber(actTimeNumber);
       }
    }
    catch (error) {
        console.log(error);
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
        buttons.Redled.writeSync(1);
        buttons.Yellowled.writeSync(1);
        buttons.Greenled.writeSync(1);

         currentPageIndex = 0;
         rootpages = pagesystem.parseJson("./sitespaths.json")
         currentpages = rootpages
         pagehistory = []
         pagehistoryindex = []
        
        
    }
}


function enterButtonStatus(status){
    if(status === true){
        if (buttons.Greenled.readSync() === 1){
        buttons.Greenled.writeSync(0);
        }
    }else{
        buttons.Greenled.writeSync(1);
    }
}

function exitButtonStatus(status){
    
    if(status === true){
         if (buttons.Redled.readSync() === 1){
        buttons.Redled.writeSync(0);}
    }else{
        buttons.Redled.writeSync(1);
    }
}

function mediaButtonStatus(status){
    if(status === true){
        if (buttons.Yellowled.readSync() === 1){
        buttons.Yellowled.writeSync(0);}
    }else{
        buttons.Yellowled.writeSync(1);
    }
}

buttons.Enterbutton.watch(function (err, value) { 
   console.log("enter",value)
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
  console.log("exit",value)
   pageChangeExit();
  
});

var playingTimeout = false;
buttons.Playbutton.watch(function (err, value) { 
    if (err) { 
        console.error('There was an error', err); 
    return;
    }
    if(playingTimeout == false){
        playMedia()
        playingTimeout = true
        setTimeout(() => { playingTimeout = false }, 500)
    }
});

var crank = require('./crankshaft.js')
var pageTurnPosition = 25
var currentPos = 0
crank.Crankshaftpos.on('event',function(pos){
    if (idlemode==false) {
        // console.log("position",pos)
        if (pos-currentPos > pageTurnPosition) {
           pageChangeForward();
           currentPos=pos; 
        }
        else if (pos-currentPos < -pageTurnPosition){
            pageChangeBackwards();
            currentPos=pos; 
        }
    }
})

crank.Crankshaftevent.on('event',function(speed){
    if(idlemode == true){
        handleCordInput(speed);
    }
});


function unexports ()
{
     buttons.Playbutton.unexport()
    buttons.Enterbutton.unexport()
    buttons.Exitbutton.unexport()
    buttons.Greenled.unexport()
    buttons.Yellowled.unexport()
    buttons.Redled.unexport()
    
}

process.on('SIGINT',  (signal) => {
        unexports()
        server.close(() => {
        console.log('Closed out remaining connections');
    })
     process.exit(0)
  });


/*
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
  */
