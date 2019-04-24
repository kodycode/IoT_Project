import paho.mqtt.client as mqtt
import pyrebase


def on_message(client, userdata, message):
    print(message.topic + " " + str(message.payload))


config = {
  "apiKey": "apiKey",
  "authDomain": "projectId.firebaseapp.com",
  "databaseURL": "https://databaseName.firebaseio.com",
  "storageBucket": "projectId.appspot.com"
}

firebase = pyrebase.initialize_app(config)

broker_address = "10.0.0.7"
client = mqtt.Client("python client")
client.connect(broker_address)

client.on_message = on_message
client.subscribe("door")
client.loop_forever()
