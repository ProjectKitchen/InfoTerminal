#!/usr/bin/env python3

from omxplayer.player import OMXPlayer
from pathlib import Path
from time import sleep

MEDIAFILE_PATH = Path('./bigben.wav')


try:
	player = OMXPlayer(MEDIAFILE_PATH,args=['--loop'])
	#player = OMXPlayer(MEDIAFILE_PATH,args=['--no-osd', '--loop'], dbus_name='org.mpris.MediaPlayer2.omxplayer0', pause=True)
except Exception as err: 
    print("****** ERROR: ******", str(err))
    
player.set_rate(2);

sleep(8);

print("maximum=" + str(player.maximum_rate()));  
print("minimum=" + str(player.minimum_rate()));  

for i in range(60,200):
	sleep(0.2);
	print(i);
	player.set_rate(i/70);
	# player.set_volume(i/10);

player.quit()

