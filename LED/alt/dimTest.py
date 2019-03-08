import time
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(37, GPIO.OUT)
 
# frequency=50Hz
p = GPIO.PWM(37, 50)  
p.start(100)
try:
    while 1:
        for dc in range(0, 101, 5):
            p.ChangeDutyCycle(dc)
            time.sleep(0.1)
            print("loop")
        for dc in range(100, -1, -5):
            p.ChangeDutyCycle(dc)
            time.sleep(0.1)
            print("2")
except KeyboardInterrupt:
    pass
    p.stop()
    GPIO.cleanup()