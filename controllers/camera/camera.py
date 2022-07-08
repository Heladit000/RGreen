from picamera import PiCamera
from datetime import datetime
from time import sleep

import base64

camera = PiCamera()

def takePhoto(timeC, callback):
    sleep(timeC)

    now = datetime.now()
    currentTime = now.strftime("%Y/%m/%d %H:%M:%S")

    camera.annotate_text = currentTime

    camera.capture('./picture.jpg')
    
    with open("./picture.jpg", "rb") as image_file:
        callback(image_file.read())

