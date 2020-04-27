import RPi.GPIO as GPIO
import time

# GPIO-Bezeichnung BCM stezen
GPIO.setmode(GPIO.BCM)

input_a = 20  # Signal A: GPIO 20
input_b = 16  # Signal B: GPIO 16

GPIO.setup(input_a, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # use internal pullup
GPIO.setup(input_b, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # use internal pullup

# get initial state
state = GPIO.input(input_a) + GPIO.input(input_b)*2   
position=0;


def update():
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
  return;


# Main Program starts here: polling loop
x=0;
while True:
  update();
  if (x!=position):
    print(position);
    x=position;


GPIO.cleanup()

