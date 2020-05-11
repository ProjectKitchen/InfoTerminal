
// Create and reference video element
var vid = document.createElement('video');

// Add class for styling
vid.classList.add('playing');

// Add a src to .vid
vid.src = '../video/IntroWithSound.m4v';

// Load .vid
vid.load();

// Add .vid to body
document.body.appendChild(vid);

// Play video
vid.play();

/* Register ended event to vid
|| After video has ended...
*/
vid.addEventListener('ended', function(e) {


let postLoad = document.querySelector("#postLoad");
postLoad.style.opacity = 1;

  // Pause vid
  vid.pause()

  /* Reset time played. This method used
  || along with .pause() is equivelant to "stop"
  */
  vid.currentTime = 0;

  // Simulate a `non-playing state`
  vid.classList.remove('playing');

  /* Delay the call to remove vid in order
  || to preserve the fade out effect.
  */
  setTimeout(function() {
    document.body.removeChild(vid);
  }, 20);
}, false);



function start(){
	location.replace(location.origin + "/websites/01_robox.html")
}


// time out function, which loads the idle animation

attachEvent(window,'load',function(){
  var idleSeconds = 30;
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

function whenUserIdle(){
  //...

  postLoad.style.opacity = 0;
  alert("I am trying (ツ) ");

}

function attachEvent(obj,evt,fnc,useCapture){
  if (obj.addEventListener){
    obj.addEventListener(evt,fnc,!!useCapture);
    return true;
  } else if (obj.attachEvent){
    return obj.attachEvent("on"+evt,fnc);
  }
}
