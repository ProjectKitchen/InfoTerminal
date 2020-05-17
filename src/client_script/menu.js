document.addEventListener("DOMContentLoaded", function (event) {

    var websocketReloading = new WebSocket('ws://' + location.hostname + ':' + location.port + '/reload');
    var load = false;

    websocketReloading.addEventListener("message", (ws) => {
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
    })

    var websocketMediaControl = websocketMediaControl = new WebSocket('ws://' + location.hostname + ':' + location.port + '/media');
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