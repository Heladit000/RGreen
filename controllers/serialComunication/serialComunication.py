import serial
import json

arduinoPort = '/dev/ttyUSB0'
connectionState = False

def startConnection(callback):
    global connectionState
    connectionState = True


    ser = serial.Serial(arduinoPort, 9600, timeout=1)
    ser.reset_input_buffer()

    serialMessage = ""

    while connectionState:   
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            callback(line)
    
    print("Serial connection Stop")

def stopConnection():
    global connectionState
    connectionState = False
