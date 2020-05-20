const Gpio = require('onoff').Gpio; 
var LED = new Gpio(13, 'out'); 
var L_Playbutton = new Gpio(17, 'in', 'both');
var M_Enterbutton = new Gpio(27, 'in','both');
var R_Exitbutton = new Gpio(22, 'in','both');

exports.Enterbutton = M_Enterbutton;
exports.Exitbutton = R_Exitbutton;
exports.Playbutton = L_Playbutton;


function unexportOnClose() { //function to run when exiting program
  LED.writeSync(1); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose);
