document.addEventListener("DOMContentLoaded", function (event) {

    var websocketMediaControl = new WebSocket('ws://' + location.hostname + ':' + location.port + '/media');
    var mediaplaying = false;
    var websocketReloading = new WebSocket('ws://' + location.hostname + ':' + location.port + '/reload');
    var load = false;
    var heartbeat=0;

    websocketReloading.addEventListener("message", handleIncomingMessage)

    function handleIncomingMessage(ws) {
        if(mediaplaying === false){
        if (ws.data.charAt(0) == '*') {
            heartbeat=0;
            console.log ("heartbeat pace!");
        } else 
        if (ws.data.charAt(0) == 's') {
            load = true
            goSleepMode()
        } else 
        if (load == false) {
            load = true
            var newfile = ws.data
            location.replace(location.origin + "/" + newfile)
        }
    }
    }


    websocketMediaControl.addEventListener("message", (ws) => {
        var video = document.getElementsByTagName("video")
        if (mediaplaying == true) {
            mediaplaying = false
    
            video[0].pause()
            video[0].style.removeProperty("position")
            video[0].style.setProperty("z-index", "-1")
            video[0].style.visibility = "hidden"
            
        } else {
            mediaplaying = true
            
            video[0].style.visibility = "visible"
            video[0].style.setProperty("position", "absolute")
            video[0].style.setProperty("z-index", "999")
            video[0].play()
        }
        console.log(mediaplaying)
    })
    websocketMediaControl.addEventListener("open", (ws) => {
        var videoTag = document.getElementsByTagName("video")
        if (videoTag.length > 0) {
            videoTag[0].style.visibility = "hidden"
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
