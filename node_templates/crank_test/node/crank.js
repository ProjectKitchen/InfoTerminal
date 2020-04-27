const Gpio = require('onoff').Gpio;

var green = '\u001b[42m \u001b[0m';
var red = '\u001b[41m \u001b[0m';



const SignalA = new Gpio(20, 'in', 'both');
const SignalB = new Gpio(16, 'in', 'both');
var position=0;
var state=SignalA.readSync()+SignalB.readSync() * 2;

console.log("");
console.log("Hi! - this is the crankspeed detector in node.js !");
console.log("remember to activate pullups for GPIO16 and GPIO20 in /boot/config.txt");
console.log(" --------------------------------------  Current Crank Speed  ---------------------------------------");


// stable encoder readout (also handling bouncing on SignalA and B):
// thanks Paul Stoffregen 
// https://github.com/PaulStoffregen/Encoder/blob/master/Encoder.h
// (R/C lowpass filter recommended on inputs to decrease system load / interrupts)
//                           _______         _______       
//               Pin1 ______|       |_______|       |______ Pin1
// negative <---         _______         _______         __      --> positive
//               Pin2 __|       |_______|       |_______|   Pin2

		//	new	new	old	old
		//	pin2	pin1	pin2	pin1	Result
		//	----	----	----	----	------
		//	0	0	0	0	no movement
		//	0	0	0	1	+1
		//	0	0	1	0	-1
		//	0	0	1	1	+2  (assume pin1 edges only)
		//	0	1	0	0	-1
		//	0	1	0	1	no movement
		//	0	1	1	0	-2  (assume pin1 edges only)
		//	0	1	1	1	+1
		//	1	0	0	0	+1
		//	1	0	0	1	-2  (assume pin1 edges only)
		//	1	0	1	0	no movement
		//	1	0	1	1	-1
		//	1	1	0	0	+2  (assume pin1 edges only)
		//	1	1	0	1	-1
		//	1	1	1	0	+1
		//	1	1	1	1	no movement

 function update() {
	s = state & 3;
	if (SignalA.readSync() == 1) s |= 4;
	if (SignalB.readSync() == 1) s |= 8;
	switch (s) {
		case 0: case 5: case 10: case 15:
			break;
		case 1: case 7: case 8: case 14:
			position++; break;
		case 2: case 4: case 11: case 13:
			position--; break;
		case 3: case 12:
			position += 2; break;
		default:
			position -= 2; break;
	}
	state = (s >> 2);
	//  console.log(position);
}

SignalA.watch((err, value) => {
  update();
});

SignalB.watch((err, value) => {
  update();
});

    
  
old_position=0;
function checkSpeed() {
  speed=(position-old_position);
  old_position=position;


  process.stdout.clearLine();  // clear current text
  if (speed>=0) process.stdout.cursorTo(50);
  else  process.stdout.cursorTo(50+speed);
  var dots = new Array(speed>0?speed:-speed).join(red);
  process.stdout.write(dots);  // write text



  // console.log("current speed="+speed);
}
     
setInterval(checkSpeed,200);
  
    
    
