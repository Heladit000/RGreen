from configparser import ConfigParser
from time import sleep

import camera

import socketio

config = ConfigParser()
config.read("../config.ini")

host = config.get("WS", "host")
port = config.get("WS", "port")

sio = socketio.Client()

cameraSleep = 5
connectionState = False

def managePhoto(b64Data):
    sio.emit("cameraData", b64Data)

def start_take_photos():
    while True:  
        camera.takePhoto(cameraSleep, managePhoto)

def try_start_connection():
    try:
        sio.connect(f"http://{host}:{port}")
    except:
        print("server connection error")
        sleep(2)
        try_start_connection()

if __name__ == "__main__":


    @sio.event
    def connect():
        print("C server connection active")
        start_take_photos()

    @sio.event
    def connect_error(err):
        print("C server connection error")

    @sio.event
    def disconnect():
        print("C server connection error")

    try_start_connection()
    


    


    