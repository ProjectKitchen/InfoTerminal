# InfoTerminal

The Infoterminal for the Project Kitchen - with Timeline of Robotics
TBD, work in progress!

# Technologies

Built With: 
This project was built with the assistance of the following libraries and tools:

 Back-End
 * [Node.js](https://nodejs.org/en/) - It is used for an event-driven, non-blocking I/O model that makes it lightweight and efficient
 
 
 Front-End
 * [Bootstrap](https://getbootstrap.com/) - Most popular HTML, CSS, and JS front-end component library

 
 Hardware
 * [Raspberry Pi](https://github.com/raspberrypi/documentation)
 * LED
 * (Long) Breadboard
 * Pushup button
 * Optional Neopixel
 * Crankshaft [EN 11 Encoder](https://static6.arrow.com/aropdfconversion/86c9eaacb1087ae9aac6133ae19f759abae66df1/en11.pdf) Datasheets

How to connect the components with Raspberry PI? [Scheme](https://github.com/ProjectKitchen/InfoTerminal#connection-scheme)

## Setup

The setup needed to run the Infoterminal.

### Raspberry Pi

Installing the operating system images [Raspberry Pi](https://github.com/raspberrypi/documentation/blob/master/installation/installing-images/README.md#installing-operating-system-images)

Recommended:

This project is using the Rasbian OS also called [Raspberry Pi OS](https://www.raspberrypi.org/downloads/raspberry-pi-os/)

### Firefox

The project works only on [Firefox](https://www.mozilla.org/en-US/firefox/enterprise/) browser 

Install process

```bash
sudo apt-get install -y firefox-esr
```
For the auto fullscreen in firefox, install add-on extentions, because the firefox browser does not support auto fullscreen.

Recommended:

For this project we used [tazeat](https://addons.mozilla.org/en-US/firefox/user/13777225/)
    
Change Setting in Firefox

To play the sound from the application in Firefox automatically, go to the Setting, on the left side tab the Privacy & Securtiy. Under sub-item called Permission, there will be a checkbox 'automatically playing sound', just uncheck it

![Firefox Settings](https://github.com/ProjectKitchen/InfoTerminal/blob/master/picture/Firefox_Preferences_Permission.png?raw=true)

### NodeJS

To be able to run the node applications nodeJS and need to be installed with the following commands:

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Afterwards the packages need to be downloaded with the ``` npm install ```.

### Setup Boot

The configurations for the buttons and the crank need to be set in the configuration file.

Add the configurations for the buttons and the crank in config.txt. 

```bash
 sudo nano /etc/config.txt
```
Entering the file, add the GPIO Pins for the buttons and the crank there.

As an example:

```bash
gpio=23,24,17,27,22=pu
```
pu means pushup

Do not forget to save the file.

### Autoscript for Raspberry

The goal is that the Firefox browser starts right after the starting Raspbian with GUI (Graphical User Interface) and displays a certain website in kiosk mode.
 
In order to run the application automatically after boot Raspbian,a script file needs to be setup.

Create a file and add the following commands.

```bash
 #!/bin/bash 
export DISPLAY=:0

cd 'PATH' /InfoTerminal/src/ ; node index.js &
cd  'PATH' InfoTerminal/src_contentmanagement/ ; node index.js & 
firefox-esr --new-window http://localhost:8080

exit 0
```
'PATH' means the location, where the project is saved.

Do not forget to save the file.

There will be a profile called 'autostart' script, which is located at ```/etc/xdg/lxsession/LXDE-pi/autostart```
 In our Rasberry Pi, we had to create this file.

 Adding the Path, where the file is created and edited. 
```bash
nano /etc/xdg/lxsession/LXDE-pi/autostart

/home/pi/Desktop/autostarter
```
Restart your Raspberry Pi, you will now see the firefox browser in full screen mode. 

### Connection scheme

Below is a simplified connection scheme for Raspberry Pi

![Raspberry PI plug-in board](https://github.com/ProjectKitchen/InfoTerminal/blob/master/picture/Infoterminal_Steckplatine.png?raw=true)

