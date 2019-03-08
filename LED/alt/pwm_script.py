


import time
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(37, GPIO.OUT)

global curBrightness
global status
global bright
global brightChanged

zcPin = 35
p = 37; 

p = GPIO.PWM(37, 50)  
p.start(100)


bright = 250

fade = 1
status = 1
tarBrightness = 255
curBrightness = 0
# 0 = ready; 1 = processing
zcState = 0
print "DimmerCode is Ready"


def dimTimerISR():
    global curBrightness
    global status
    global bright
    global brightChanged
    
    print("dimTimerISR")
    if (fade == 1):
      if (curBrightness > tarBrightness or (status == 0 and curBrightness > 0)):
        curBrightness -=1
      
      elif (curBrightness < tarBrightness and status == 1 and curBrightness < 255):
        curBrightness +=1
        
      
    
    else:
      if (status == 1):
        curBrightness = tarBrightness
      
      else:
        curBrightness = 0
      
    
    
    if (curBrightness == 0):
      status = 0
      digitalWrite(pwmPin, 0)
    
    elif (curBrightness == 255):
      status = 1
      digitalWrite(pwmPin, 1)
    
    else:
      digitalWrite(pwmPin, 1)
    
    
    zcState = 0
    
    
#dimTimerISR()
  
def setLights(pin, curBrightness):
    realBrightness = int(int(brightness) * (float(bright) / 255.0))
    p.ChangeDutyCycle(pin, curBrightness)
    
    
setLights(p, curBrightness)