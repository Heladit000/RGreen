import waterPump
import configparser
import socketio

sio = socketio.Client()

#----Get configuration----
config = configparser.ConfigParser()
config.read("../config.ini")

sio_host = config.get("WS", "host")
sio_port = config.get("WS", "port")
sio_event = "actuators/waterPump"
#-------------------------

@sio.event
def connect():
    print("WP server connection active")
    waterPump.start_quick_water_pump(0.1)

@sio.event
def connect_error(err):
    print("WP server connection error")

@sio.event
def disconnect():
    print("WP server connection error")

@sio.on(sio_event)
def status(data):
    if(data == True):
        print("Water pump start")
        waterPump.start_quick_water_pump(1)
        

if __name__ == "__main__":

    sio.connect(f"http://{sio_host}:{sio_port}")
  
