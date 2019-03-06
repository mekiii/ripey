import hw_timer.h     

zcPin = 35
pwmPin = 37; 

fade = 1
status = 1
tarBrightness = 255
curBrightness = 0
# 0 = ready; 1 = processing
zcState = 0


def setup():
  #Serial.begin(115200);   
  pinMode(zcPin, INPUT_PULLUP)
  pinMode(pwmPin, OUTPUT)
  
  #Attach an Interupt to Pin 2 (interupt 0) for Zero Cross Detection
  attachInterrupt(zcPin, zcDetectISR, RISING);     
  hw_timer_init(NMI_SOURCE, 0)
  hw_timer_set_func(dimTimerISR)


def loop():
  # put your main code here, to run repeatedly:
    if (Serial.available()):
        int val = Serial.parseInt()
        if (val>0):
          tarBrightness =val
          Serial.println(tarBrightness)
        
        
    



def dimTimerISR():
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


def zcDetectISR():
  if (zcState == 0):
    zcState = 1
  
    if (curBrightness < 255 and curBrightness > 0):
      digitalWrite(pwmPin, 0)
      
      int dimDelay = 30 * (255 - curBrightness) + 400;//400
      hw_timer_arm(dimDelay)
    
  
