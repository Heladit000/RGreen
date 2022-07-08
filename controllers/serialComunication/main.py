import serialComunication 

import socketio

sio = socketio.Client()


def manageSensorsConnection(data):
    print(data)
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

    @sio.event
    def disconnect():
        serialComunication.stopConnection()
        print("SC server connection error")

    sio.connect("http://localhost:3000")





