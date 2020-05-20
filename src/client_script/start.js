




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

  var startup = 0

  function handleIncomingMessage (ws) {
      var rate = ws.data
      console.log(rate)
      startvideo.playbackrate = rate/100*2
      if(rate >= 100){
        startup++;
      }
      if(startup > 100){
        startvideo.pause()
        startVideo()
      }
  }

  function changeToNormal(){
    websocketStartup.send("start")
    location.replace(location.origin + "/websites/01_robox.html")
  }

  // adding the video element to the DOM, to play the starting animation
function startVideo(){
  var vid = document.createElement('video');
  
  vid.classList.add('playing');
  
  vid.src = '../../video/start.m4v';
  
  vid.load();
  vid.style.setProperty("position","absolute")
  vid.style.setProperty("z-index","999")
  document.body.appendChild(vid)
  document.getElementById("startvideo").remove()
  vid.play();
  
  vid.addEventListener('ended', function(e) {
  
  
  //let postLoad = document.querySelector("#postLoad");
  //postLoad.style.opacity = 1;
  
    vid.pause()
  
    vid.currentTime = 0;
  
    vid.classList.remove('playing');
     changeToNormal()
    setTimeout(function() {
      document.body.removeChild(vid);
    }, 20);
  }, true);
  }
})

