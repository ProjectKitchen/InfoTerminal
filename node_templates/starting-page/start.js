
// adding the video element to the DOM, to play the starting animation
var vid = document.createElement('video');

vid.classList.add('playing');

vid.src = '../video/start.m4v';

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



function start(){
	location.replace(location.origin + "/websites/01_robox.html")
}


// time out function, which checks for user activity

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

// loading the exit animation

  postLoad.style.opacity = 0;

  var vid2 = document.createElement('video');

  vid2.classList.add('playing');

  vid2.src = '../video/0-3.m4v';

  vid2.load();

  document.body.appendChild(vid2);

  vid2.play();

  // removing the vid2 from the DOM after it had played
    vid2.addEventListener('ended', function(e) {

      vid2.pause()

      vid2.currentTime = 0;

      vid2.classList.remove('playing');

      setTimeout(function() {
        document.body.removeChild(vid2);
      }, 20);
    }, true);

  // looping the idle animation

  var vid3 = document.createElement('video');

  vid3.classList.add('playing');

  vid3.src = '../video/0-1.m4v';

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
