import RPi.GPIO as GPIO
import time
import threading
import board
import statistics
from rpi_ws281x import PixelStrip, Color
from websocket_server import WebsocketServer

def new_client(client, server):
	print ("a new client has joined");

def new_message(client, server, message):
	print ("message received: " + message);



# LED strip configuration:
LED_COUNT = 35        # Number of LED pixels.
#LED_PIN = 18          # GPIO pin connected to the pixels (18 uses PWM!).
LED_PIN = 10        # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ = 900000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 10          # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255  # Set to 0 for darkest and 255 for brightest
LED_INVERT = False    # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53

# Create NeoPixel object with appropriate configuration.
strip = PixelStrip(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
# Intialize the library (must be called once before other functions).
strip.begin()

# GPIO-Mode BCM
GPIO.setmode(GPIO.BCM)

input_a = 23  # Signal A: GPIO 23
input_b = 24  # Signal B: GPIO 24

GPIO.setup(input_a, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # use internal pullup
GPIO.setup(input_b, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # use internal pullup

# global variables
position=0;
old_position=0;
pixelpos=0;
old_pixel=0;
timestamp = time.time();
buf = [0.0 for x in range(12)];
fadeoutCounter=0;

# get initial state
state = GPIO.input(input_a) + GPIO.input(input_b)*2   

def update(channel):
  global state,position;
  s = state;
  if (GPIO.input(input_a) == 1):
      s |= 4;
  if (GPIO.input(input_b) == 1):
      s |= 8;
    
  if (s==1) or (s==7) or (s==8) or (s==14):
      position+=1;
  elif (s==2) or (s==4) or (s==11) or (s==13):
      position-=1;
  elif (s==3) or (s==12):
      position+=2;
  elif (s==9) or (s==6):
      position-=2;
  state = (s >> 2);
  #print(position);
  updateNeopixels();
  return;




def updateNeopixels():
  global position, old_position, pixelpos, old_pixel, timestamp, fadeoutCounter;

  change = (position-old_position)/4
  old_position=position;

  pixelpos+=change;
  if (pixelpos>=LED_COUNT):
    pixelpos-=LED_COUNT;

  if (pixelpos<0):
    pixelpos+=LED_COUNT;
  
  act_pixel=int(pixelpos);
    
  if (act_pixel != old_pixel):
    if (change>0):
      strip.setPixelColor(act_pixel, Color(255,0,0));
    else:
      strip.setPixelColor(act_pixel, Color(0,0,255));
    old_pixel=act_pixel;
    
    period=time.time()-timestamp;
    timestamp=time.time();
    fadeoutCounter=0;
    period=1.0-(period*3);
    if (period<0):
        period=0;
    if (change<0):
        period=-period;
    # print (period);
    rate=statistics.mean(buf);
    if (abs(rate) < 0.15):
      if (period > 0.0):
        buf.append(period+3.0);
      else:
        buf.append(period-3.0);
        
    else:
      buf.append(period);     
    buf.pop(0);
    rate=statistics.mean(buf);
    if (abs(rate)<0.15):
      rate=0;
    print("fadeout:" + str(fadeoutCounter) + " speed:" + str(rate));
    server.send_message_to_all(str(rate));
  return;
  
  

GPIO.add_event_detect(input_a,GPIO.BOTH,callback=update)
GPIO.add_event_detect(input_b,GPIO.BOTH,callback=update)


def fadePixels():
  global timestamp, fadeoutCounter;
  for i in range (0,LED_COUNT):
    r= (strip.getPixelColor(i) >> 16) & 0xff ;
    g= (strip.getPixelColor(i) >> 8) & 0xff ;
    b= (strip.getPixelColor(i) >> 0) & 0xff ;
    r= int(r*0.8);
    g= int(g*0.8);
    b= int(b*0.8);
    strip.setPixelColor(i,Color(r,g,b));
  strip.show()

  if (time.time()-timestamp > 0.07):
    timestamp=time.time()
    buf.pop(0);
    buf.append(0.0);
    fadeoutCounter+=1;
    rate=statistics.mean(buf);
    if (abs(rate)<0.15):
      rate=0;
    print("fadeout:" + str(fadeoutCounter) + " speed:" + str(rate));
    server.send_message_to_all(str(rate));
    
  threading.Timer(0.05, fadePixels).start()

fadePixels();

server = WebsocketServer(8765, host='127.0.0.1')
server.set_fn_new_client(new_client)
server.set_fn_message_received(new_message)
server.run_forever()


GPIO.cleanup()

