import RPi.GPIO as GPIO
import time
import board
from rpi_ws281x import PixelStrip, Color


# LED strip configuration:
LED_COUNT = 14        # Number of LED pixels.
#LED_PIN = 18          # GPIO pin connected to the pixels (18 uses PWM!).
LED_PIN = 10        # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
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

input_a = 20  # Signal A: GPIO 20
input_b = 16  # Signal B: GPIO 16

GPIO.setup(input_a, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # use internal pullup
GPIO.setup(input_b, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # use internal pullup

# global variables
position=0;
old_position=0;
pixelpos=0;

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
  global position, old_position, pixelpos;

  change = (position-old_position)/4
  old_position=position;

  pixelpos+=change;
  if (pixelpos>=LED_COUNT):
    pixelpos-=LED_COUNT;

  if (pixelpos<0):
    pixelpos+=LED_COUNT;

  if (change > 0):
    strip.setPixelColor(int(pixelpos), Color(255,0,0));
  elif (change <0):
    strip.setPixelColor(int(pixelpos), Color(0,0,255));

  return;
  
  

GPIO.add_event_detect(input_a,GPIO.BOTH,callback=update)
GPIO.add_event_detect(input_b,GPIO.BOTH,callback=update)

# Main Program starts here: polling loop
while True:
  time.sleep(0.04);
  for i in range (0,LED_COUNT):
    r= (strip.getPixelColor(i) >> 16) & 0xff ;
    g= (strip.getPixelColor(i) >> 8) & 0xff ;
    b= (strip.getPixelColor(i) >> 0) & 0xff ;
    r= int(r*0.8);
    g= int(g*0.8);
    b= int(b*0.8);
    strip.setPixelColor(i,Color(r,g,b));
  strip.show()


GPIO.cleanup()

