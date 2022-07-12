from configparser import ConfigParser
import serialComunication 

import socketio

sio = socketio.Client()

config = ConfigParser()
config.read("../config.ini")

host = config.get("SERVER", "host")
port = config.get("SERVER", "port")

def manageSensorsConnection(data):
    sio.emit("sensorsData", data)

if __name__ == "__main__":

    @sio.event
    def connect():
        print("SC server connection active")
        serialComunication.startConnection(manageSensorsConnection)
    
    @sio.event
    def connect_error(err):
        serialComunication.stopConnection()
        print("SC server connection error")
        exit()

    @sio.event
    def disconnect():
        serialComunication.stopConnection()
        print("SC server connection error")

    sio.connect(f"http://{host}:{port}")





