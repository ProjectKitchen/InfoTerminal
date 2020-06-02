const Gpio = require('onoff').Gpio; 
var L_GreenLedPin = new Gpio(18, 'out');
var M_YellowLedPin = new Gpio(12, 'out');
var R_RedLedPin = new Gpio(13, 'out'); 
var L_Playbutton = new Gpio(17, 'in', 'both');
var M_Enterbutton = new Gpio(27, 'in','both');
var R_Exitbutton = new Gpio(22, 'in','both');

exports.Enterbutton = M_Enterbutton;
exports.Exitbutton = R_Exitbutton;
exports.Playbutton = L_Playbutton;

exports.Greenled = L_GreenLedPin;
exports.Redled = R_RedLedPin;
exports.Yellowled = M_YellowLedPin;

/*
function pressed_enterButton()
{
  bt.Exitbutton.watch(function (err, value) { 
  if (err) { 
    console.error('There was an error', err); 
  return;
  }
   pageChangeExit();
  
});
  }
*/


/*function unexportOnClose() { //function to run when exiting program
 // GreenLedPin.writeSync(1); // Turn LED off
  var GPIO_data = [L_GreenLedPin,M_RedLedPin,R_YellowLedPin,L_Playbutton,
                        M_Enterbutton,R_Exitbutton];
  for (i=0; i < GPIO_data.length; i++){
     GPIO_data[i].unexport();
    }
                           // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose);
*/
