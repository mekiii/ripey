# import RPi.GPIO as GPIO

# -----------------------------------------------------
RED_PIN   = 17
GREEN_PIN = 22
BLUE_PIN  = 24

# Number of color changes per step (more is faster, less is slower).
# You also can use 0.X floats.
STEPS     = 0.01

# execute terminal command and start pigpiod
import os
os.system("sudo pigpiod")

###### END ######
import sys
import termios
import tty
import pigpio
import time
from thread import start_new_thread

bright = 40
r = 0.0
g = 0.0


brightChanged = False
abort = False
state = True
raiseColor = 0
onlyRed = 0
yellow = False
test = False

pi = pigpio.pi()

def updateColor(color, step):
    color += step
    # print ("update color")
    
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
    global yellow
    global test
    global raiseColor

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
            print ("onlyRed = 1")
            break
            
        if c == 'y':
            onlyRed = 0
            yellow = True
            
            print ("yellow = true")
            
        
        if c == 't':
            test = True
            print ("test = true")
            
        
        if c == 'c' and not abort:
            yellow = False
            onlyRed = 0
            abort = True
            break

        

start_new_thread(checkKey, ())




print ("+ / - = Increase / Decrease brightness")
print ("p / w = Pause / weiter")
print ("c = Abort Program")

setLights(RED_PIN, r)
setLights(GREEN_PIN, g)

if onlyRed == 1:
    raiseColor = 0
    
    


def key_functions():
    global bright
    global brightChanged
    global state
    global abort
    global onlyRed
    global yellow
    global test
    global raiseColor
    global r
    global g
    
    #make light for 5 secs
    t_end = time.time() + 5
    while time.time() < t_end:
        setLights(RED_PIN, 200)
        setLights(GREEN_PIN, 100)
        #print ("time = 5 secs")
    print ("5 sec are over")
    setLights(RED_PIN, 0)
    setLights(GREEN_PIN, 0)
        


#    #make green light
#    while abort == False and onlyRed == 0 and yellow == False and test == False:
#        if state and not brightChanged:    
#            if raiseColor == 0:
#                g = updateColor(g, +STEPS)
#                setLights(GREEN_PIN, g)
#                print ("g++")
#                # time.sleep(2)
                

#    # when r-key hit
#    while abort == False and onlyRed == 1:
#        if state and not brightChanged:
#            # light go out
#            if raiseColor == 0:
#                r = updateColor(r, -STEPS)
#                setLights(RED_PIN, r)
#                g = updateColor(g, -STEPS)
#                setLights(GREEN_PIN, g)
#                #print ("r-- and g--")
#                if r <= 5:
#                    raiseColor = 1
#                    print ("raiseColor = 1")
#
#            if raiseColor == 1:
#                r = updateColor(r, STEPS)
#                setLights(RED_PIN, r)
#                print ("only r++")
#                if r >= 30:
#                    raiseColor = 0
#                    print ("only r--")
#                    print ("still looping")
#                    
    # when y-key hit
    #yellow = True
    while abort == False and yellow == True:
        if state and not brightChanged:
            # light go out
            if raiseColor == 0:
                r = updateColor(r, -STEPS)
                setLights(RED_PIN, r)
                g = updateColor(g, -STEPS)
                setLights(GREEN_PIN, g)
                print (r)
                if r <= 5:
                    raiseColor = 1
                    # print ("raiseColor = 1")

            if raiseColor == 1:
                r = updateColor(r, STEPS)
                setLights(RED_PIN, r)
                r = updateColor(r, STEPS)
                setLights(RED_PIN, r)
                print ("yellow =", r ,g)
                g = updateColor(g, STEPS)
                setLights(GREEN_PIN, g)
                if r >= 30:
                    raiseColor = 0
                    # print ("only r--")
                    # print ("still looping")
#                    
#    # when t-key hittet
#    if test == True:
#        # define  wanted color for red and green LED
#        r = 205
#        g = 100
#        print ("test r =" , r, "and g =", g)
#        # now set red and green LED to wanted brightness
#        setLights(RED_PIN, r)
#        setLights(GREEN_PIN, g)
#        raiseColor = 0
#        while abort == False:
#            if state and not brightChanged:
#                # make wave effect
#                
#                if raiseColor == 0:
#                    r = updateColor(r, -STEPS)
#                    setLights(RED_PIN, r)
#                    g = updateColor(g, -STEPS)
#                    setLights(GREEN_PIN, g)
#                    print ("r =", r)
#                    if g <= 5:
#                        raiseColor = 1
#                        print ("raiseColor = 1")
#
#                if raiseColor == 1:
#                    r = updateColor(r, STEPS)
#                    setLights(RED_PIN, r)
#                    print ("yellow =", r ,g)
#                    g = updateColor(g, STEPS)
#                    setLights(GREEN_PIN, g)
#                    if r >= 150:
#                        raiseColor = 0

# key_functions()
                
####################### RELAIS SCRIPT START
def startRelais(): 
    #import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)

    ## spreche GPIO pin 14 an
    relais = 14
    #
    GPIO.setmode(GPIO.BCM)
    #
    GPIO.setup(relais, GPIO.OUT)
    #setLights(RED_PIN, 0)
    #setLights(GREEN_PIN, 0)
    print ("GREEN AND RED = 0")
    #key_functions()
    
    
    GPIO.output(relais, GPIO.LOW)
    time.sleep(5)
    print ("low = high1")
    
    GPIO.output(relais, GPIO.HIGH)
    time.sleep(5)
    print ("high1 = low")

#
#GPIO.output(relais, GPIO.LOW)
#time.sleep(5)

 
####################### RELAiS SCRIPT END

####### START PIR

import RPi.GPIO as GPIO
SENSOR_PIN = 23
 
GPIO.setmode(GPIO.BCM)
GPIO.setup(SENSOR_PIN, GPIO.IN)


movement = False

print ("Bereit")

def mein_callback(channel):
    # Hier kann alternativ eine Anwendung/Befehl etc. gestartet werden.
    print('Es gab eine Bewegung!')
    
    start_new_thread(startRelais, ())
    start_new_thread(key_functions, ())
    
    
    
   
try:
    GPIO.add_event_detect(SENSOR_PIN , GPIO.RISING, callback=mein_callback)
    print ("waiting")
    while True:
        time.sleep(100)
except KeyboardInterrupt:
    print "Beende..."
GPIO.cleanup()

 
########### END PIR 
 
print ("Aborting...")

setLights(RED_PIN, 0)
setLights(GREEN_PIN, 0)

time.sleep(0.5)

pi.stop()#





