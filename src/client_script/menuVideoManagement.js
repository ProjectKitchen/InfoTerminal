

    var websocketMediaControl = new WebSocket('ws://' + location.hostname + ':' + location.port + '/media');
    var mediaplaying = false;
    var websocketReloading = new WebSocket('ws://' + location.hostname + ':' + location.port + '/reload');
    var load = false;
    var heartbeat=0;

    websocketReloading.addEventListener("message", handleIncomingMessage)

    function handleIncomingMessage(ws) {
        console.log(ws.data)
        if (ws.data.charAt(0) == '*') {
            heartbeat=0;
            console.log ("heartbeat pace!");
        } else 
        if (ws.data.charAt(0) == 's') {
            load = true
            goSleepMode()
        } else 
        if (load == false && mediaplaying === false) {
            load = true
            var newfile = ws.data
            location.replace(location.origin + "/" + newfile)
    
        }
    }


    websocketMediaControl.addEventListener("message", (ws) => {
        
        if (ws.data === "true"){
            mediaplaying = true
            }else if(ws.data === "false"){
                mediaplaying = false
                }
                console.log(mediaplaying)
    })
    websocketMediaControl.addEventListener("open", (ws) => {
        var videoTag = document.getElementsByTagName("video")
        if (videoTag.length > 0) {
            
            websocketMediaControl.send(true)
        }
        else {
            websocketMediaControl.send(false)
        }
    })
    
    
    setInterval(function(){
        heartbeat=heartbeat+1;
        console.log("checking heartbeat ..." + heartbeat)
       // if(websocketReloading != undefined){
       //     if(websocketReloading.readyState == 3) // 3 is closed
            if (heartbeat > 3)
            {
                console.log("problem found, trying to reload page!")
                location.reload()
                heartbeat=0;
            }
  //      }
    }, 1000)
    

function getSound(src) {
    var sound = document.createElement("audio");
    sound.src = src;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.setAttribute("hide", "true");
    sound.style.display = "none";
    document.body.appendChild(sound);
    return sound;
}

function goSleepMode() {
    var vid2 = document.createElement('video');

    vid2.classList.add('playing');

    vid2.src = '../../video/0-3.m4v';
    vid2.style.setProperty("position", "absolute")
    vid2.style.setProperty("z-index", "999")
    vid2.load();

    document.body.appendChild(vid2);
    vid2.play();
    vid2.addEventListener('ended', function (e) {
        location.replace(location.origin + "/")
    }, true)
}

  
var direction=0;


function showOverlay(){
       document.getElementById("ovl").style.opacity = "1.0";
}

function hideOverlay(){
       document.getElementById("ovl").style.opacity = "0.0";
}


  var myPlayer1 = document.getElementById("player1"); 
  myPlayer1.mozPreservesPitch = false;
  myPlayer1.loop=true; 
  myPlayer1.volume=0.0;
  myPlayer1.playbackRate=0; 
  myPlayer1.play(); 
  var myPlayer2 = document.getElementById("player2"); 
  myPlayer2.mozPreservesPitch = false;
  myPlayer2.loop=true; 
  myPlayer2.volume=0.0; 
  myPlayer2.playbackRate=0; 
  myPlayer2.play(); 

   function InitWebSocket() {
      
      if ("WebSocket" in window) {
         // Let us open a web socket
         var ws = new WebSocket("ws://localhost:8765");
         console.log("Websocket opened");
         ws.onopen = function() {     
            // Web Socket is connected, send data using send()
            ws.send("hello server!");
            console.log("hello-message sent");
         };

         ws.onmessage = function (evt) {
           
            var received_msg = evt.data;
            console.log("received:" + received_msg);
            rate = parseFloat(received_msg);
            slider.value=rate*100;
            output.innerHTML=rate*100;

            if (rate>0.0 && mediaplaying === true) {
              if (direction!=1) { 
                 showOverlay(); 
                 direction=1;
                 myPlayer1.volume=1.0;
                 myPlayer2.volume=0.0;
              }

              myPlayer1.playbackRate = rate;
              duration=myPlayer1.duration; 
              actTime=myPlayer1.currentTime;
              newTime=duration-actTime;
              myPlayer2.currentTime=newTime;
              
            }  else if (rate < 0.0 && mediaplaying === true) {
              if (direction!=-1) { 
                 hideOverlay(); 
                 direction=-1;
                 myPlayer2.volume=1.0;
                 myPlayer1.volume=0.0;
              }
              myPlayer2.playbackRate = -rate;
              duration=myPlayer2.duration; 
              actTime=myPlayer2.currentTime;
              newTime=duration-actTime;
              myPlayer1.currentTime=newTime;

            }  else {
              if (direction!=0) { 
                 myPlayer1.playbackRate=0.0;
                 myPlayer2.playbackRate=0.0;
              }
            }
         };

         ws.onclose = function() {           
            // websocket is closed.
            console.log("Connection closed.");
         };
      } else {      
         // The browser doesn't support WebSocket
         alert("WebSocket NOT supported by your Browser!");
      }
   }
   
  var slider = document.getElementById("speedRange");
  var output = document.getElementById("actSpeed");
  output.innerHTML = slider.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
    myPlayer1.playbackRate = this.value/100;  
  }

  InitWebSocket();

