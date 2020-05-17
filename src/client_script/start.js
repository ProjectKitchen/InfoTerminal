
function changeToNormal(){
  websocketStartup.send("start")
	location.replace(location.origin + "/websites/01_robox.html")
}

// adding the video element to the DOM, to play the starting animation
var vid = document.createElement('video');

vid.classList.add('playing');

vid.src = '../../video/start.m4v';

vid.load();

document.body.appendChild(vid);

vid.play();

vid.addEventListener('ended', function(e) {


let postLoad = document.querySelector("#postLoad");
postLoad.style.opacity = 1;


  vid.pause()

  vid.currentTime = 0;

  vid.classList.remove('playing');

  setTimeout(function() {
    document.body.removeChild(vid);
  }, 20);
}, true);


// time out function, which checks for user activity
/*
attachEvent(window,'load',function(){
  var idleSeconds = 15;
  var idleTimer;
  function resetTimer(){
    clearTimeout(idleTimer);
    idleTimer = setTimeout(whenUserIdle,idleSeconds*1000);
  }
  attachEvent(document.body,'mousemove',resetTimer);
  attachEvent(document.body,'keydown',resetTimer);
  attachEvent(document.body,'click',resetTimer);

  resetTimer(); // Start the timer when the page loads
});



  // looping the idle animation

  var vid3 = document.createElement('video');

  vid3.classList.add('playing');

  vid3.src = '/video/0-1.m4v';

  vid3.load();

  document.body.appendChild(vid3);

  vid3.play();

  vid3.loop = true;

}

function attachEvent(obj,evt,fnc,useCapture){
  if (obj.addEventListener){
    obj.addEventListener(evt,fnc,!!useCapture);
    return true;
  } else if (obj.attachEvent){
    return obj.attachEvent("on"+evt,fnc);
  }
}
*/

document.addEventListener("DOMContentLoaded", function (event) {
  var startvideo = document.getElementById("startvideo");
  startvideo.mozPreservesPitch = false;
  startvideo.loop=true;
  startvideo.volume=0.0;
  var websocketStartup = new WebSocket('ws://' + location.hostname + ':' + location.port + '/startup');

  websocketStartup.addEventListener("message", handleIncomingMessage)

  function handleIncomingMessage (ws) {
      console.log(ws.data)
      var rate = ws.data
      startvideo.playbackrate = rate
      
      startvideo.play(); 
  }
})