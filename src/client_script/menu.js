document.addEventListener("DOMContentLoaded", function(event) {

    var websocketReloading = new WebSocket('ws://' + location.hostname + ':' + location.port + '/reload');
    var load = false;
    var websocketMediaControl = websocketMediaControl = new WebSocket('ws://' + location.hostname + ':' + location.port + '/media');
    var media = false;

    websocketReloading.addEventListener("message", (ws) => {
        if (load == false) {
            load = true
            var sound = getSound(location.origin + "/audio/" + "next.wav")
            sound.play()
            var newfile = ws.data
            location.replace(location.origin + "/" + newfile)
        }
    })
    websocketMediaControl.addEventListener("message", (ws) => {
        if (media == false) {
            media = true
            console.log(ws)
        }
    })
    websocketMediaControl.addEventListener("open", (ws) => {
        console.log(ws)
        websocketMediaControl.send("Media Control is ready!")

        var video = document.getElementsByTagName("video")
        if (video.length > 0) {
            websocketMediaControl.send("Side has a video!")
        }
        else {
            websocketMediaControl.send("Side has no video!")
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