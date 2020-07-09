const Gpio = require('onoff').Gpio; 
var M_GreenLedPin = new Gpio(13, 'out');
var L_YellowLedPin = new Gpio(18, 'out');
var R_RedLedPin = new Gpio(12, 'out'); 



var L_Playbutton = new Gpio(27, 'in', 'both');
var M_Enterbutton = new Gpio(22, 'in','both');  
var R_Exitbutton = new Gpio(17, 'in','both');  

// rot enter 17, gelb exit 27, green play 22

exports.Enterbutton = M_Enterbutton;
exports.Exitbutton = R_Exitbutton;
exports.Playbutton = L_Playbutton;

exports.Greenled = M_GreenLedPin;
exports.Redled = R_RedLedPin;
exports.Yellowled = L_YellowLedPin;
