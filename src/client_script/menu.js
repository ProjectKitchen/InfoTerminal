document.addEventListener("DOMContentLoaded", function (event) {

    var websocketReloading = new WebSocket('ws://' + location.hostname + ':' + location.port + '/reload');
    var load = false;

    websocketReloading.addEventListener("message", handleIncomingMessage)

    function handleIncomingMessage(ws) {
        console.log(ws)
        if (ws.data.charAt(0) == 's') {
            load = true
            goSleepMode()
        }
        if (load == false) {
            load = true
            var newfile = ws.data
            location.replace(location.origin + "/" + newfile)
        }
    }

    var websocketMediaControl = new WebSocket('ws://' + location.hostname + ':' + location.port + '/media');
    var mediaplaying = false;

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
