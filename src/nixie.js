
var SPI = require('pi-spi');
const { Gpio } = require( 'onoff' );

const CS1 = new Gpio( '25',  'out' );
const CS2 = new Gpio( '7', 'out' );
const CS3 = new Gpio( '1',  'out' );
const CS4 = new Gpio( '16', 'out' );

CS1.writeSync( 1 ); // 1: disable chip select signal! 
CS2.writeSync( 1 );
CS3.writeSync( 1 );
CS4.writeSync( 1 );

var spi = SPI.initialize("/dev/spidev1.0");
// SPI0.0: MOSI [BCM 10, physical pin 19] 
// spi.dataMode(SPI_NO_CS);

const redLed = 20;
const greenLed = 0;
const blueLed = 50;

let fadeTimer;
actNixieNumber=0;
nextNixieNumber=-1;
intensity=127;
fading=0;
fadeTimer=undefined;


var setNixie = function(cs, d, i) { 
return new Promise(resolve => { 
		var test = Buffer.from([0xaa, 0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x00,0x00,0x00]);
		test[13]=0x80|redLed;
		test[14]=0x80|greenLed;
		test[15]=0x80|blueLed;
		if (d==0) d=10;
		test[d]=0x80|i;
		cs.writeSync( 0 );
		spi.transfer(test, test.length, function (e,d) {
			cs.writeSync( 1 );
			if (e) console.error(e);
			resolve(1); 
		});
	}); 
}; 

  
var nixieDisplay = async function(number,i) { 

await setNixie(CS1, number%10 ,i);
number=parseInt(number/10);
await setNixie(CS2, number%10, i);
number=parseInt(number/10);
await setNixie(CS3, number%10, i);
number=parseInt(number/10);
await setNixie(CS4, number%10, i);

} 


  

function doFading(dir) {
	if (dir>0) {
		if (intensity+dir<=127) intensity+=dir;
		else { clearInterval (fadeTimer); fading=0; }
	} else {
		if (intensity+dir>=0) intensity+=dir;
		else { 
			clearInterval (fadeTimer);
			if (nextNixieNumber==-1) {
				fading=0; 
			} else {
				actNixieNumber=nextNixieNumber;
				nextNixieNumber=-1;
				fadeTimer = setInterval(() => { doFading(-dir); }, 10);
			}
		}
	}
    nixieDisplay(actNixieNumber,intensity);                  
}

function fade(step,interval) {
  fadeTimer = setInterval(() => { doFading(step); }, interval);
}

function displayNixieNumber() {
	if (fading==0) nixieDisplay(actNixieNumber,intensity);                  
}

function fadeNixieNumber(n,speed) {
  nextNixieNumber=n;
  fadeTimer = setInterval(() => { doFading(-speed); }, 20);
}

displayNixieNumber();

exports.setNixieNumber = function(number){
	if (fadeTimer!=undefined) {
		clearInterval (fadeTimer);
		intensity=127;
	}
    console.log("nixie:",number);
    fadeNixieNumber(number,20);
}
