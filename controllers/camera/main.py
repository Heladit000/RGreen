from configparser import ConfigParser
from time import sleep

import camera

import socketio

config = ConfigParser()
config.read("../config.ini")

host = config.get("SERVER", "host")
port = config.get("SERVER", "port")

sio = socketio.Client()

cameraSleep = 60
connectionState = False

def managePhoto(b64Data):
    sio.emit("cameraData/send", b64Data)

def start_take_photos():
    while True:  
        camera.takePhoto(cameraSleep, managePhoto)

def try_start_connection():
    try:
        sio.connect(f"http://{host}:{port}")
    except:
        print("server connection error")

if __name__ == "__main__":
    @sio.event
    def connect():
        print("C server connection active")
        camera.takePhoto(2, managePhoto)
        start_take_photos()

    @sio.event
    def connect_error(err):
        print("C server connection error")
        exit()

    @sio.event
    def disconnect():
        print("C server connection error")

    try_start_connection()
    


    


    