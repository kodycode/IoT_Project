from picamera import PiCamera
from time import sleep
import paho.mqtt.client as mqtt
import pyrebase
import time


def on_message(client, userdata, message):
    global msg_sent
    global db
    global user
    global pushing
    global storage
    global camera
    if int(message.payload) == 0:
        if not msg_sent and not pushing:
            pushing = True
            print("Taking picture..")
            sleep(5)
            current_time = time.time()
            camera.capture('./img/{}.jpg'.format(current_time))
            print("Picture taken")
            print('Uploading image..')
            imageLocation = "images/{}.png".format(current_time)
            storage.child(imageLocation).put("./img/{}.jpg".format(current_time), user['idToken'])
            imageURL = storage.child(imageLocation).get_url(user['idToken'])
            data = {"imageUrl": "{}".format(imageURL), "timeStamp": "{}".format(time.time())}
            print('Image uploaded')
            # Pass the user's idToken to the push method
            print('Pushing..')
            db.child("date").push(data, user['idToken'])
            # send to firebase and wait until script goes back to 0
            print('Data pushed')
            msg_sent = True
            pushing = False
    else:
        if not pushing:
            if msg_sent:
                # set script back to state where it can update firebase
                msg_sent = False
                print('Resetting..')


msg_sent = False
pushing = False

config = {
  "apiKey": "apiKey",
  "authDomain": "projectId.firebaseapp.com",
  "databaseURL": "https://databaseName.firebaseio.com",
  "storageBucket": "projectId.appspot.com"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
user = auth.sign_in_with_email_and_password('test@gmail.com', '123456')
db = firebase.database()
storage = firebase.storage()

broker_address = "127.0.0.1"
client = mqtt.Client("python client")
client.connect(broker_address)

client.on_message = on_message
client.subscribe("door")
print("Broker online")
client.loop_forever()
