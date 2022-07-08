import atexit
import RPi.GPIO as GPIO
from time import sleep

water_pump_pin = 18

GPIO.setwarnings(False)

def start_quick_water_pump(time):
    GPIO.setmode(GPIO.BCM)        
    GPIO.setup(water_pump_pin, GPIO.OUT)    

    GPIO.output(water_pump_pin, GPIO.LOW)
    sleep(time)
    GPIO.output(water_pump_pin, GPIO.HIGH)

def exit_handler():
    GPIO.cleanup()

atexit.register(exit_handler)


