# import RPi.GPIO as GPIO
import os
#os.system("sudo pigpiod")

import sys
import termios
import tty
import pigpio
import time
from thread import start_new_thread
import RPi.GPIO as GPIO
#------------------------------------------------------------------------
#Start importData Script
#import database at localhost
import MySQLdb
global plantState
ventilatorRelais = 14
VentilatorisOn = False
LEDisOn = False
DatabaseIsFetched = False
t_end = 0
t_led_end = 0

#global reif

db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="runmysql",  # your password
                     db="planta")        # name of the data base

# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()



# DEFINE RASPBERRY PINS-----------------------------------------------------
RED_PIN   = 17 # RED_PIN is on GPIO.PIN 17 
GREEN_PIN = 22  # GREEN_PIN is on GPIO.PIN 22 
BLUE_PIN  = 24  # BLUE_PIN is on GPIO.PIN 24 

# Number of color changes per step (more is faster, less is slower). You also can use 0.X floats.
STEPS     = 0.5
# execute terminal command and start pigpiod


bright = 40
r = 0.0
g = 0.0
b = 0.0

brightChanged = False
abort = False
state = True
raiseColor = 0
yellow = False

pi = pigpio.pi()

def updateColor(color, step):
    color += step
    # print ("update color")
    if color > 255:
        return 255
    if color < 0:
        return 0
        
    return color

# set Lightsfunction
def setLights(pin, brightness):
    realBrightness = int(int(brightness) * (float(bright) / 255.0))
    pi.set_PWM_dutycycle(pin, realBrightness)

raiseColor = 0
    
def startLedStrip():
    global bright
    global brightChanged
    global state
    global abort
    global yellow
    global raiseColor
    global r
    global g
    global b
    
    #make lightwave-effect for 5 secs
    t_end = time.time() + 5
    while time.time() < t_end:
        if state and not brightChanged:
            # light go out
            if raiseColor == 0:
                r = updateColor(r, -STEPS)
                setLights(RED_PIN, r)
                r = updateColor(r, -STEPS)
                setLights(RED_PIN, r)
                g = updateColor(g, -STEPS)
                setLights(GREEN_PIN, g)
                b = updateColor(b, -0.5 * STEPS)
                setLights(BLUE_PIN, g)
                #print ("\n", r)
                if g <= 5:
                    raiseColor = 1
                    # print ("raiseColor = 1")
            #light go on
            if raiseColor == 1:
                r = updateColor(r, STEPS)
                setLights(RED_PIN, r)
                r = updateColor(r, STEPS)
                setLights(RED_PIN, r)
                #print ("yellow =", r ,g)
                g = updateColor(g, STEPS)
                setLights(GREEN_PIN, g)
                b = updateColor(b, 0.5 * STEPS)
                setLights(BLUE_PIN, g)
                if g >= 100:
                    raiseColor = 0
                    # print ("only r--")
                    
    print ("\n >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 5 sec are over")
    setLights(RED_PIN, 0)
    setLights(GREEN_PIN, 0)
    setLights(BLUE_PIN, 0)




####################### STOP GROWLIGHT SCRIPT START
def setGrowLight(not_active): 
    #import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    ## spreche GPIO pin 15 an
    relais = 15
    #while round(time.time()) % 2 == 0:
        #print('\n xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx stop growlight!')
    
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(relais, GPIO.OUT)
    
    if not_active:
        print ("Growlight is OFFFFFFFFF")
        GPIO.output(relais, GPIO.LOW)
    
    else:
        print ("Growlight is OOOOOOOOON")
        GPIO.output(relais, GPIO.HIGH)   
####################### STOP GROWLIGHT SCRIPT END



# Use all the SQL you like
#cur.execute("SELECT * FROM anbau")

cur.execute("SELECT Status FROM anbau ORDER BY PrimKey DESC LIMIT 1")

# print all the first cell of all th rows
plantState = cur.fetchall()[0][0]
print ("==============================", plantState)

def getPlantState():
    if round(time.time()) % 5 == 0 :
        cur.execute("SELECT Status FROM anbau ORDER BY PrimKey DESC LIMIT 1")

        # print all the first cell of all th rows
        plantState = cur.fetchall()[0][0]
        print ("==============================", plantState)
   
#start_new_thread(getPlantState, ())


def checkPlantState():
    if plantState == "reif":
        setGrowLight(True)
    else:
        setGrowLight(False)
        

####### START PIR
SENSOR_PIN = 23
GPIO.setmode(GPIO.BCM)
GPIO.setup(SENSOR_PIN, GPIO.IN)

print ("\n Bereit")

def motionDetected(channel):
    LEDisOn = True
    VentilatorisOn = True


while True:
    
    #if time.time()%1 == 0:
        #DatabaseIsFetched = True
        
    #if DatabaseIsFetched == True:
    db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                user="root",         # your username
                passwd="runmysql",  # your password
                db="planta")        # name of the data base

    # you must create a Cursor object. It will let
    #  you execute all the queries you need
    cur = db.cursor()
    cur.execute("SELECT Status FROM anbau ORDER BY PrimKey DESC LIMIT 1")
    # print all the first cell of all th rows
    plantState = cur.fetchall()[0][0]
    print ("==============================", plantState)
    checkPlantState()
    #DatabaseIsFetched = False
    
    if GPIO.input(SENSOR_PIN) == 1 and plantState =='reif':
        VentilatorisOn = True
        LEDisOn = True
    
    if VentilatorisOn == True:
        t_end = time.time() + 5
        VentilatorisOn = False
    
    if time.time() < t_end:
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(ventilatorRelais, GPIO.OUT)
        
        #print ("\n set Relais to LOW to start Ventilator")
        GPIO.output(ventilatorRelais, GPIO.LOW)
    else:
        #print ("\n set Relais to HIGH to stop Ventilator")
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(ventilatorRelais, GPIO.OUT)
        GPIO.output(ventilatorRelais, GPIO.HIGH)
    
    ######
    if LEDisOn == True:
        t_led_end = time.time() + 9
        LEDisOn = False
        
    if time.time() < t_led_end:
        if state and not brightChanged:
            # light go out
            if raiseColor == 0:
                r = updateColor(r, -STEPS)
                setLights(RED_PIN, r)
                r = updateColor(r, -STEPS)
                setLights(RED_PIN, r)
                g = updateColor(g, -STEPS)
                setLights(GREEN_PIN, g)
                b = updateColor(b, -0.5 * STEPS)
                setLights(BLUE_PIN, g)
                #print ("\n", r)
                if g <= 5:
                    raiseColor = 1
                    # print ("raiseColor = 1")
            #light go on
            if raiseColor == 1:
                r = updateColor(r, STEPS)
                setLights(RED_PIN, r)
                r = updateColor(r, STEPS)
                setLights(RED_PIN, r)
                #print ("yellow =", r ,g)
                g = updateColor(g, STEPS)
                setLights(GREEN_PIN, g)
                b = updateColor(b, 0.5 * STEPS)
                setLights(BLUE_PIN, g)
                if g >= 100:
                    raiseColor = 0
                    # print ("only r--")
    else:                
        setLights(RED_PIN, 0)
        setLights(GREEN_PIN, 0)
        setLights(BLUE_PIN, 0)
        
    
    








