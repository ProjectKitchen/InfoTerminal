document.addEventListener("DOMContentLoaded", function (event) {

  var startvideo = document.getElementById("startvideo");
  startvideo.mozPreservesPitch = false;
  startvideo.loop = true;
  startvideo.volume = 1;
  startvideo.playbackRate = 0.5
  var websocketStartup = new WebSocket('ws://' + location.hostname + ':' + location.port + '/startup');

  websocketStartup.addEventListener("message", handleIncomingMessage)

  setInterval(function(){ console.log(websocketStartup)},5000)

  var heartbeat=0;
  var startup = 0
  var startupInProgress = false
  function handleIncomingMessage(ws) {
    var rate = ws.data
    if (ws.data.charAt(0) == '*') {
            heartbeat=0;
            console.log ("heartbeat pace!");
        } else{
    if (startupInProgress == false) {
      if (rate < 0) {
        rate = -rate;
      }
      
      if (rate >= 10) {
        clearTimeout(fadeOutTimeout)
        fadeOutTimeout = undefined
        startup++;
        //soundFadeIn();
        playbackFadein();
      }else{
        
        fadeOut()
      }
      if (startvideo.playbackRate >= 1.2) {
        startupInProgress = true
        
        
        startTransitionVideo()
      }
    }
  }
}
  
  var fadeOutTimeout = undefined
function fadeOut(){
    if(fadeOutTimeout === undefined){
      fadeOutTimeout = setTimeout(function(){
      if(startvideo.volume >= 0.05){
      }
      if(startvideo.playbackRate >= 0.25){
        startvideo.playbackRate -= 0.05
      if(playbackRateCur >= 0.20){
        playbackRateCur = startvideo.playbackRate
      }
      }
      if(startup > 0){
        startup--
      }
      fadeOutTimeout = undefined
  },200)
  }
}
  
  // This is for the gradual increase of idle mode animation sound when the system is initially started
  // Initial volume of 0.20
  // Make sure it's a multiple of 0.05
  var vol = 0.20;
  var interval = 200;
  var fadeinSound = undefined
  function soundFadeIn(fadeIn) {
    if (fadeinSound == undefined) {
      fadeinSound = setTimeout(
        function () {
          if(fadeIn == true){
            vol += 0.05;
            }
          
          if (vol <= 1) {
            startvideo.volume = vol;
            fadeinSound = undefined
          }
          else {
            clearTimeout(fadeinSound);
          }
        }, interval);
    }
  }
  var playbackRateCur = 0.2;
  var interval = 200;
  var fadeinPlayback = undefined
  function playbackFadein() {
    if(fadeinPlayback == undefined){
    fadeinPlayback = setTimeout(
      function () {
        if (playbackRateCur < 1.2) {
          playbackRateCur += 0.05;
          startvideo.playbackRate = playbackRateCur;
          fadeinPlayback = undefined
        }
        else {
          clearTimeout(fadeinPlayback);
        }
      }, interval);
    }
  }

  function changeToNormal() {
    websocketStartup.send("start")
    location.replace(location.origin + "/websites/01_robox.html")
  }

  // adding the video element to the DOM, to play the starting animation
  function startTransitionVideo() {
    var vid = document.createElement('video');
    vid.src = '../../video/start.mp4';
    vid.load();
    vid.style.setProperty("position", "absolute")
    vid.style.setProperty("z-index", "999")
    document.body.appendChild(vid)
    vid.volume = 1;
    setTimeout(function(){
      vid.play();
	startvideo.pause()
    startvideo.style.visibility = "hidden"
    vid.addEventListener('ended', function (e) {
      vid.pause()
      vid.currentTime = 0;
      changeToNormal()
      setTimeout(function () {
        document.body.removeChild(vid);
      }, 50);
    }, true);
      },500)
    
  }
  
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
  
})
