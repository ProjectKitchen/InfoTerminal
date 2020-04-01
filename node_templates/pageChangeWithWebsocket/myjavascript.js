var socket = io(); //load socket.io-client and connect to the host that serves the page
        window.addEventListener("load", function () { //when page loads
            socket.emit("reload", 1); //send button status to server (as 1 or 0)
        });
        var load = false;
        socket.on('reload', function (data) { //get button status from client
            if (load == false) {
                load = true
                console.log(location.origin + "/" + data);
                location.replace(location.origin + "/" + data)
                
            }
            
            socket.emit("reload", data); //send push button status to back to server
        });