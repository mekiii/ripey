import RPi.GPIO as GPIO
import time

# spreche GPIO pin 14 an
relais = 14

GPIO.setmode(GPIO.BCM)

GPIO.setup(relais, GPIO.OUT)

GPIO.output(relais, GPIO.HIGH)
time.sleep(5)

GPIO.output(relais, GPIO.LOW)
time.sleep(5)
#led9.updateColor()

# importiere led9 - script
import led9

GPIO.output(relais, GPIO.HIGH)
time.sleep(5)


GPIO.output(relais, GPIO.LOW)
time.sleep(5)