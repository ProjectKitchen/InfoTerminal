# Express try out

Try to implement the page change with the express a nodejs framework. The framework handels the serving of the static files and also has thorugh an addtional module express-ws, websockets integrated. The websockets on the client-side work with the standard Javascript implementation which makes loading any additional js files on the browser side obsoulte. A simple check if a websocket is connected or not for to the page change has been implemented.

Navigation between the sites is done with the w, a ,s ,d keys:
w - entering site if it has subsites
s - exiting site if it has a rootsite
a - change site on the same level
d - changing site on the same level

The following url can be used as a starting point for the browser
Startpath:  http://localhost:8080/websites/start.html