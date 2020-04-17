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
})