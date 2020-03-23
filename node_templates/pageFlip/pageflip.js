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
var loadInterval = setInterval(autoPageFlips, 1000); // automatically flip page after 1 second 
setTimeout(endPageFlips, 5000);  // stop automatic flips after 5 seconds 

function loadPage() { // function to load a page in browser (starts default browser if not running)
    var filename='./shifz/';
    if (actPage < 10) filename+='0'+actPage+'.html';
    else filename+=actPage+'.html';
    
    console.log("loading page"+filename);  
    opener(filename) // opens the url/file in the default browser 
}

function autoPageFlips() { 
    actPage++; 
    if (actPage > maxPage) actPage=minPage;
    loadPage();
}

function endPageFlips() {  
  console.log("end autoamtic page flips!");  
  clearInterval(loadInterval);  // stop intervals

}



ioHook.on("keydown", event => {
  // console.log(event);
  // result: {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}
  if (event.rawcode == 39) {
    console.log("cursor right!");
    actPage++;
    if (actPage > maxPage) actPage=minPage;
    loadPage();
  }
  if (event.rawcode == 37) { 
    console.log("cursor left!");
    actPage--;
    if (actPage < minPage) actPage=maxPage;
    loadPage();
  }
  if (event.rawcode == 38) console.log("cursor up!");
  if (event.rawcode == 40) console.log("cursor down!");
});

//Register and stark hook 
ioHook.start();
