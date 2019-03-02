#!/usr/bin/python

# Import der Python libraries
import RPi.GPIO as GPIO
import time
import datetime

# Wir verwenden den Board Mode, Angabe der PIN Nummern anstelle der GPIO BCM Nummer
GPIO.setmode(GPIO.BOARD)

# GPIO definieren, 23 da bei mir der Sensor auf Pin7 steckt
GPIO_PIR = 23

print "Bewegungsmelder Test (CTRL-C zum Beenden)"
print "========================================="

#  GPIO als "Input" festlegen
GPIO.setup(GPIO_PIR,GPIO.IN)

Current_State  = 0
Previous_State = 0

try:

 print "%s: Sensor initialisieren ..." % datetime.datetime.now() 

 # Warten bis Sensor sich meldet
 while GPIO.input(GPIO_PIR)==1:
   Current_State  = 0
   
 print "%s: Fertig! Warte auf Bewegung..."  % datetime.datetime.now()

 # Schleife bis CTRL+C
 while True :

   #Status von Sensor auslesen
   Current_State = GPIO.input(GPIO_PIR)
   # print ("waiting")

   if Current_State==1 and Previous_State==0:

     print " %s: Bewegung erkannt!" % datetime.datetime.now() 
     Previous_State=1

   elif Current_State==0 and Previous_State==1:

     print " %s: Fertig! Warte auf Bewegung..."  % datetime.datetime.now() 
     Previous_State=0

   time.sleep(0.01)

except KeyboardInterrupt:
 print " Exit"
 GPIO.cleanup()
