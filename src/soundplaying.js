var exec = require('child_process').exec;
var player="omxplayer";
if (process.platform == 'win32') player="cmdmp3.exe";

function puts (error, stdout, stderr) { 
    console.log(stdout); 
} 

var sound = {

    playSound: function (name){
         var soundfile_name = name;
        console.log ("play sound:"+player+" " + soundfile_name);
        var playerProcess=exec(player+" "+soundfile_name); // , puts);
        console.log("playerProcess pid="+playerProcess.pid);
    }, 
    stopAllSounds: function () {
        var killcmd
        if (player=="cmdmp3.exe") 
            killcmd="taskkill /im cmdmp3.exe /f";
        else killcmd="killall omxplayer.bin";
        console.log ("stop all ongoing sounds:"+killcmd);
        exec(killcmd);
    }
}

module.exports = sound;