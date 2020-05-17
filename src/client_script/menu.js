document.addEventListener("DOMContentLoaded", function (event) {

    var websocketReloading = new WebSocket('ws://' + location.hostname + ':' + location.port + '/reload');
    var load = false;

    websocketReloading.addEventListener("message", handleIncomingMessage)

    function handleIncomingMessage (ws) {
        console.log(ws)
        if(ws.data.charAt(0) == 's'){
            load = true
            goSleepMode()
        }
        if (load == false) {
            load = true
            var newfile = ws.data.substring(1)
            var soundpath = ""
            switch (ws.data.charAt(0)) {
                case 'f':
                    soundpath = "next.wav"
                    break;
                case 'b':
                    soundpath = "prev.wav"
                    break;
                case 'e':
                    soundpath = "enter.wav"
                    break;
                case 'x':
                    soundpath = "exit.wav"
                    break;
            }
            var sound = getSound(location.origin + "/audio/" + soundpath)
            sound.play()
            sound.onended = function () {
                location.replace(location.origin + "/" + newfile)
            }
        }
    }

    var websocketMediaControl = new WebSocket('ws://' + location.hostname + ':' + location.port + '/media');
    var mediaplaying = false;

    websocketMediaControl.addEventListener("message", (ws) => {
        var video = document.getElementsByTagName("video")
        if (mediaplaying == true) {
            video[0].pause()
            video[0].style.removeProperty("position")
            video[0].style.setProperty("z-index","-1")
            mediaplaying = false
        } else {
            video[0].style.setProperty("position","absolute")
            video[0].style.setProperty("z-index","999")
            video[0].play()
            mediaplaying = true
        }
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
})

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

function goSleepMode(){
    // When the system is in the idle mode, the exit animation will be played and then the walking bull animation will be looped.
  
  // loading the exit animation
    //postLoad.style.opacity = 0;
  
    var vid2 = document.createElement('video');
  
    vid2.classList.add('playing');
  
    vid2.src = '../../video/0-3.m4v';
    vid2.style.setProperty("position","absolute")
    vid2.style.setProperty("z-index","999")
    vid2.load();
  
    document.body.appendChild(vid2);
  
    vid2.play();
  
    // removing the vid2 from the DOM after it had played
      vid2.addEventListener('ended', function(e) {
  
        //vid2.pause()
  
        //vid2.currentTime = 0;
  
        //vid2.classList.remove('playing');
        location.replace(location.origin + "/")
      }, true)}