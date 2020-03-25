//
// simple demo for loading htlm pages into a browser
// first page fips are done automatically, then cursor right/left is captured to show next/prev page
//
// note: that the browser must be configured to show pages in the same tab and set tu fullscreen mode 
//    e.g. firefox: https://www.ghacks.net/2009/07/03/force-firefox-to-open-links-in-same-tab/
//    the browser must be the default application to open .html files
// the iohook package requires certian node versions (need pre-built packages) - e.g. node 10.0.0
//    see: https://wilix-team.github.io/iohook/installation.html 


'use strict';
const ioHook = require('iohook');
var opener = require('opener');

var actPage=1;
var minPage=1;
var maxPage=20;

function loadPage() { // function to load a page in browser (starts default browser if not running)
    var filename='./shifz/';
    if (actPage < 10) filename+='0'+actPage+'.html';
    else filename+=actPage+'.html';
    
    console.log("loading page"+filename);  
    opener(filename) // opens the url/file in the default browser 
}

ioHook.on("keydown", event => {
  console.log(event);
  // result: {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}

  if (event.keycode == 32) {
    console.log("key d: right!");
    actPage++;
    if (actPage > maxPage) actPage=minPage;
    loadPage();
  }

  if (event.keycode == 30) {
    console.log("key a: left!");
    actPage--;
    if (actPage < minPage) actPage=maxPage;
    loadPage();
  }
  if (event.keycode == 17) console.log("key w: enter (currently not supported, TBD)");
  if (event.keycode == 31) console.log("key s: exit (currently not supported, TBD)");
  if (event.keycode == 57) console.log("key space: play (currently not supported, TBD)");
});

//Register and stark hook 

ioHook.start();
console.log("---- WELCOME ------");
console.log("This is the pageflip demo");
console.log("Install firefox browser (iceweasel on RaspberryPi)");
console.log("Use fullscreen and load pages in the same tab (about:config newwindow=1)");
console.log("Press keys A,D,W,S and <Space>");
console.log(" ");
loadPage()
