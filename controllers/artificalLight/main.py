import artificalLight
import configparser
import socketio

sio = socketio.Client()

#----Get configuration----
config = configparser.ConfigParser()
config.read("../config.ini")

sio_host = config.get("WS", "host")
sio_port = config.get("WS", "port")
sio_event = "actuators/artificialLight"
#-------------------------

@sio.event
def connect():
    print("AL server connection active")
    #artificalLight.turn_on_quick_articial_light()
    sio.emit(sio_event, "light")

@sio.event
def connect_error(err):
    print("AL server connection error")

@sio.event
def disconnect():
    print("AL server connection error")

@sio.on(sio_event)
def status(data):
    if(data == True):
        print("artifical light on")
        artificalLight.turn_on_artificial_light()
    else:
        print("artifical light off")
        artificalLight.turn_off_artifical_light()

if __name__ == "__main__":
    sio.connect(f"http://{sio_host}:{sio_port}")
  
