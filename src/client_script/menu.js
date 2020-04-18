document.addEventListener("DOMContentLoaded", function (event) {

    var websocketReloading = new WebSocket('ws://' + location.hostname + ':' + location.port + '/reload');
    var load = false;

    websocketReloading.addEventListener("message", (ws) => {
        if (load == false) {
            load = true
            var sound = getSound(location.origin + "/audio/" + "next.wav")
            sound.play()
            var newfile = ws.data
            location.replace(location.origin + "/" + newfile)
        }
    })

    var websocketMediaControl = websocketMediaControl = new WebSocket('ws://' + location.hostname + ':' + location.port + '/media');
    var media = false;
    var mediaplaying = false;

    websocketMediaControl.addEventListener("message", (ws) => {
        var video = document.getElementsByTagName("video")
        if (mediaplaying == true) {
            video[0].pause()
            mediaplaying = false
        } else {
            video[0].play()
            mediaplaying = true
        }
    })
    websocketMediaControl.addEventListener("open", (ws) => {
        var videoopen = document.getElementsByTagName("video")
        if (videoopen.length > 0) {
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