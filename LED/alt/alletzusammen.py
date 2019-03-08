# import RPi.GPIO as GPIO
#!/usr/bin/python
import MySQLdb
global plantState

db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="runmysql",  # your password
                     db="planta")        # name of the data base

# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

# Use all the SQL you like
#cur.execute("SELECT * FROM anbau")
cur.execute("SELECT Status FROM anbau ORDER BY PrimKey DESC LIMIT 1")

# print all the first cell of all th rows
plantState = cur.fetchall()[0][0]
print ("==============================0", plantState)
   
    

#db.close()
# -----------------------------------------------------
RED_PIN   = 17
GREEN_PIN = 22
BLUE_PIN  = 20

# Number of color changes per step (more is faster, less is slower).
# You also can use 0.X floats.
STEPS     = 0.05

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

bright = 250
r = 0.0
g = 0.0
b = 0.0


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
setLights(BLUE_PIN, b)

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
    global b
    
    #make light for 5 secs
    t_end = time.time() + 5
    while time.time() < t_end:
        if state and not brightChanged:
            # light go out
            if raiseColor == 0:
                r = updateColor(r, -STEPS)
                setLights(RED_PIN, r)
                r = updateColor(r, -STEPS)
                setLights(RED_PIN, r)
                g = updateColor(g, -0.5 * STEPS)
                setLights(GREEN_PIN, g)
                b = updateColor(b, -0.5 * STEPS)
                setLights(BLUE_PIN, b)
                #print (r)
                if g <= 5:
                    raiseColor = 1
                    # print ("raiseColor = 1")

            if raiseColor == 1:
                r = updateColor(r, STEPS)
                setLights(RED_PIN, r)
                r = updateColor(r, 0.5 * STEPS)
                setLights(RED_PIN, r)
                #print ("yellow =", r ,g)
                g = updateColor(g, STEPS)
                setLights(GREEN_PIN, g)
                b = updateColor(b, 0.5 * STEPS)
                setLights(BLUE_PIN, b)
                if g >= 120:
                    raiseColor = 0
                    # print ("only r--")
                    # print ("still looping")
    print ("5 sec are over")
    setLights(RED_PIN, 0)
    setLights(GREEN_PIN, 0)
    setLights(BLUE_PIN, 255)
    print (b)
        
       

####################### RELAIS SCRIPT START
def startRelais(): 
    #import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    ## spreche GPIO pin 14 an
    relais = 14
    
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(relais, GPIO.OUT)
    
    
    print ("set Relais to LOW to start Ventilator")
    GPIO.output(relais, GPIO.LOW)
    time.sleep(5)
    
    print ("set Relais to HIGH to stop Ventilator")
    GPIO.output(relais, GPIO.HIGH)   
####################### RELAiS SCRIPT END

####### START PIR
import RPi.GPIO as GPIO
SENSOR_PIN = 23
 
GPIO.setmode(GPIO.BCM)
GPIO.setup(SENSOR_PIN, GPIO.IN)

movement = False

print ("Bereit")

def mein_callback(channel):
    # Start ventilator (relais).
    start_new_thread(startRelais, ())
    # Start Light
    start_new_thread(key_functions, ())
    print('Es gab eine Bewegung!')
    print ("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", plantState)
    if plantState == "reif":
        print ("Reif + Bewegung")
   
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

setLights(RED_PIN, 25)
setLights(GREEN_PIN, 0)
setLights(BLUE_PIN, 25)
print (b , r)


time.sleep(0.5)

pi.stop()#





