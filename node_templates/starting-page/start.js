
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

const websocketReloading = new WebSocket('ws://' + location.hostname + ':' + location.port + '/reload');
var load = false;
websocketReloading.addEventListener("message", (ws) =>{
    if (load == false) {
        load = true
        location.replace(location.origin + "/" + ws.data)
    }
})

const websocketMediaControl = new WebSocket('ws://' + location.hostname + ':' + location.port + '/media');
var media = false;
websocketMediaControl.addEventListener("message", (ws) =>{
    if (media == false) {
        media = true
        console.log(ws)
    }
})
websocketMediaControl.addEventListener("open", (ws) =>{
        console.log(ws)
        websocketMediaControl.send("Media Control is ready!")

        var video = document.getElementsByTagName("video")
        if(video.length > 0){
            websocketMediaControl.send("Side has a video!")
        }else{
            websocketMediaControl.send("Side has no video!")
        }
})
