## Pageflip test application
Small demo for static html page flips using the browser.
On RaspberryPi, iceweasel should be installed and about:config parameter open_newwindow should be set to 1 (so that loaded pages are displayed in the same tab).
This demo uses iohook to capture keyboard inputs globally, so that the keys A and D can be used to navigate a set of webpages. 
The iohook package had to be compiled from sources for Arm/RaspberryPi (there is a pre-built version for x86 which only works for node 10.0.0).
The build for ARM caused a lot o problems but finally worked after considering
https://github.com/wilix-team/iohook/issues/37 and https://github.com/wilix-team/iohook/issues/72
If you have problems with opener on windows 10, you can use child_process instead:
https://stackoverflow.com/questions/5775088/how-to-execute-an-external-program-from-within-node-js
The iohook.node file was built using node 12.13.1 and is provided in folder iohook-build
