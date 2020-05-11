
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
}, true);



function start(){
	location.replace(location.origin + "/websites/01_robox.html")
}


// time out function, which loads the idle animation

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

function whenUserIdle(){
  // When the system is in the idle mode, the exit animation will be played and then the walking bull animation will be looped.
  //This is just a proof of concept.

  postLoad.style.opacity = 0;

  var vid2 = document.createElement('video');

  vid2.classList.add('playing');

  vid2.src = '../video/0-1.m4v';

  vid2.load();

  document.body.appendChild(vid2);

  vid2.play();

  vid2.loop = true;

}

function attachEvent(obj,evt,fnc,useCapture){
  if (obj.addEventListener){
    obj.addEventListener(evt,fnc,!!useCapture);
    return true;
  } else if (obj.attachEvent){
    return obj.attachEvent("on"+evt,fnc);
  }
}
