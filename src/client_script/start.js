document.addEventListener("DOMContentLoaded", function (event) {

  var startvideo = document.getElementById("startvideo");
  startvideo.mozPreservesPitch = false;
  startvideo.loop=true;
  startvideo.volume=0.0;
  var websocketStartup = new WebSocket('ws://' + location.hostname + ':' + location.port + '/startup');

  websocketStartup.addEventListener("message", handleIncomingMessage)

  var startup = 0
var startupInProgress = false
  function handleIncomingMessage (ws) {
      var rate = ws.data
      
      console.log(rate)
      
      if(startupInProgress == false){
        if(rate < 0)
        {
          rate = -rate;
          }
       var playback = rate/10
       if(playback > 4) {
         playback = 4
         }
       startvideo.playbackRate= playback;
      
      if(rate >= 10){
        startup++;
        fadein;
      }
      if(startup > 100){
          startupInProgress = true
        startvideo.pause()
        startVideo()
      }
  }
  }
 // This is for the gradual increase of idle mode animation sound when the system is initially started
  // Initial volume of 0.20
  // Make sure it's a multiple of 0.05
  var vol = 0.20;
  var interval = 200;

  var fadein = setInterval(
    function() {
      // This works as long as you start with a multiple of 0.05!
      if (vol < 1) {
        vol += 0.05;
        vol = vol % 1;
        startvideo.volume = vol;
      }
      else {
        clearInterval(fadein);
      }
    }, interval);


  function changeToNormal(){
    websocketStartup.send("start")
    location.replace(location.origin + "/websites/01_robox.html")
  }

  // adding the video element to the DOM, to play the starting animation
function startVideo(){
  var vid = document.createElement('video');
  vid.src = '../../video/start.m4v';
  vid.load();
  vid.style.setProperty("position","absolute")
  vid.style.setProperty("z-index","999")
  document.body.appendChild(vid)
  vid.volume = 1.0;
  vid.play();
  vid.addEventListener('ended', function(e) {
    vid.pause()
    vid.currentTime = 0;
    changeToNormal()
    setTimeout(function() {
      document.body.removeChild(vid);
    }, 50);
  }, true);
  }
})
