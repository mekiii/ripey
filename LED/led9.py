import RPi.GPIO as GPIO
import time

import os
os.system("sudo pigpiod")


SENSOR_PIN = 23
 
GPIO.setmode(GPIO.BCM)
GPIO.setup(SENSOR_PIN, GPIO.IN)

print ("Bereit")
onlyRed = 0

def mein_callback(channel):
    # Hier kann alternativ eine Anwendung/Befehl etc. gestartet werden.
    print('Es gab eine Bewegung!')
    onlyRed = 1
     
    try:
        GPIO.add_event_detect(SENSOR_PIN , GPIO.RISING, callback=mein_callback)
        while True:
            time.sleep(100)
    except KeyboardInterrupt:
        print "Beende..."
    GPIO.cleanup()



 # -----------------------------------------------------
 # File        fading.py
 # Authors     David Ordnung
 # License     GPLv3
 # Web         http://dordnung.de/raspberrypi-ledstrip/
 # -----------------------------------------------------
 # 
 # Copyright (C) 2014-2017 David Ordnung
 # 
 # This program is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by



# the Free Software Foundation, either version 3 of the License, or
 # any later version.
 #  
 # This program is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 # 
 # You should have received a copy of the GNU General Public License
 # along with this program. If not, see <http://www.gnu.org/licenses/>
#


# This script needs running pigpio (http://abyz.co.uk/rpi/pigpio/)


###### CONFIGURE THIS ######

# The Pins. Use Broadcom numbers.
RED_PIN   = 17
GREEN_PIN = 22
BLUE_PIN  = 24

# Number of color changes per step (more is faster, less is slower).
# You also can use 0.X floats.
STEPS     = 0.01

###### END ######
import os
import sys
import termios
import tty
import pigpio
import time
from thread import start_new_thread

bright = 80
r = 255.0
g = 0.0


brightChanged = False
abort = False
state = True

pi = pigpio.pi()

def updateColor(color, step):
    color += step
    print ("update color")
    
    if color > 255:
        return 255
    if color < 0:
        return 0
        
    return color


def setLights(pin, brightness):
    realBrightness = int(int(brightness) * (float(bright) / 255.0))
    pi.set_PWM_dutycycle(pin, realBrightness)


def getCh():
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    
    try:
        tty.setraw(fd)
        ch = sys.stdin.read(1)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        
    return ch


def checkKey():
    global bright
    global brightChanged
    global state
    global abort
    global onlyRed 

    while True:
        c = getCh()
        
        if c == '+' and bright < 255 and not brightChanged:
            brightChanged = True
            time.sleep(0.1)
            brightChanged = False
            
            bright = bright + 0.1
            print ("Current brightness: %d" % bright)
            
        if c == '-' and bright > 0 and not brightChanged:
            brightChanged = True
            time.sleep(0.1)
            brightChanged = False
            
            bright = bright - 0.01
            print ("Current brightness: %d" % bright)
            
        if c == 'p' and state:
            state = False
            print ("Pausing...")
            
            time.sleep(0.1)
            
            setLights(RED_PIN, 0)
            setLights(GREEN_PIN, 0)
            
        if c == 'w' and not state:
            state = True
            print ("weiter...")
            
        if c == 'r' and onlyRed == 0:
            onlyRed = 1
            break
            
        
        if c == 'c' and not abort:
            abort = True
            break

        

start_new_thread(checkKey, ())


print ("+ / - = Increase / Decrease brightness")
print ("p / w = Pause / weiter")
print ("c = Abort Program")


setLights(RED_PIN, r)
setLights(GREEN_PIN, g)

raiseColor = 0

if onlyRed == 1:
    raiseColor = 0
    
while abort == False and onlyRed == 0:
    if state and not brightChanged:    
        if raiseColor == 0:
            g = updateColor(g, +STEPS)
            setLights(GREEN_PIN, g)
            print ("g++")      
                   
while abort == False and onlyRed == 1:
    if state and not brightChanged:    
        if raiseColor == 0:
            r = updateColor(r, -STEPS)
            setLights(RED_PIN, r)
            g = updateColor(g, -STEPS)
            setLights(GREEN_PIN, g)
            print ("r-- and g--")
            if r <= 5:
                raiseColor = 1
                print ("raiseColor = 1")

        if raiseColor == 1:
            r = updateColor(r, STEPS)
            setLights(RED_PIN, r)
            print ("only r++")
            if r >= 30:
                raiseColor = 0
                print ("only r--")
                print ("still looping")                    
            
print ("Aborting...")

setLights(RED_PIN, 0)
setLights(GREEN_PIN, 0)

time.sleep(0.5)

pi.stop()#


