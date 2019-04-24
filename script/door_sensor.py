import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)
GPIO.setup(10, GPIO.IN, pull_up_down=GPIO.PUD_UP)

print("Door Sensor Online")

while True:
    if GPIO.input(10):
        print("Door is open")
        time.sleep(2)
    if not GPIO.input(10):
        print("Door is closed")
        time.sleep(2)
