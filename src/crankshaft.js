const Gpio = require('onoff').Gpio;
const EventEmitter = require('events')
const myemitter = new EventEmitter();

exports.Crankshaftevent = myemitter;
exports.Crankshaftevent2 = myemitter;
const SignalA = new Gpio(23, 'in', 'both');
const SignalB = new Gpio(24, 'in', 'both');
var position=0;
var state=SignalA.readSync()+SignalB.readSync() * 2;

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
}
 

SignalA.watch((err, value) => {
  update();
});

SignalB.watch((err, value) => {
  update();
});
  
old_position=0;

function checkSpeed() {
  var speed=(position-old_position);
  old_position=position;
  myemitter.emit('event',speed);
}

setInterval(checkSpeed,200);
