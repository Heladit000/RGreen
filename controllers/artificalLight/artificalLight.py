import atexit
import RPi.GPIO as GPIO
from time import sleep

artificial_light_pin = 24

GPIO.setwarnings(False)

def turn_on_quick_articial_light():
    GPIO.setmode(GPIO.BCM)        
    GPIO.setup(artificial_light_pin, GPIO.OUT)    
    
    GPIO.output(artificial_light_pin, GPIO.LOW)
    sleep(0.5)
    GPIO.output(artificial_light_pin, GPIO.HIGH)


def turn_on_artificial_light():
    GPIO.setmode(GPIO.BCM)        
    GPIO.setup(artificial_light_pin, GPIO.OUT)    
    GPIO.output(artificial_light_pin, GPIO.LOW)

def turn_off_artifical_light():
    GPIO.setmode(GPIO.BCM)        
    GPIO.setup(artificial_light_pin, GPIO.OUT)    
    GPIO.output(artificial_light_pin, GPIO.HIGH)


def exit_handler():
    GPIO.cleanup()

atexit.register(exit_handler)