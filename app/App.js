import React from 'react'
import firebase from 'firebase'
import '@firebase/firestore'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Platform, Dimensions, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, Modal } from 'react-native'
import { Permissions, Notifications } from 'expo';

const { width, height } = Dimensions.get('screen')

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentImage: '',
      modalVisible: false,
      dates: [],
      token: ''
    }
    console.disableYellowBox = true
  }

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }
    
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return
    }
    
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync()

    if (Platform.OS === 'android') {
      Expo.Notifications.createChannelAndroidAsync('door', {
        name: 'door',
        sound: true,
      });
    }
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    firebase.firestore().collection('notifications')
    .doc('kodythach@gmail.com')
    .set({ pushToken: token })
    this.setState({ token })
  }

  componentWillMount = async () => {
    await this.initializeFirebase()
    var dbInstance = firebase.database()
    var dateRef = dbInstance.ref('date')
    await this.registerForPushNotificationsAsync()
    dateRef.on('value', (snapshot) => {
      var tempMessages = []
      for (date in snapshot.val()) {
        tempMessages.push(snapshot.val()[date])
      }
      this.setState({ dates: tempMessages.reverse() }, () => this.sendPushNotification())
    })
  }

  initializeFirebase = async () => {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: '<YOUR-API-KEY>',
      authDomain: '<YOUR-AUTH-DOMAIN>',
      databaseURL: '<YOUR-DATABASE-URL>',
      storageBucket: '<YOUR-STORAGE-BUCKET>'
    }

    await firebase.initializeApp(firebaseConfig)
  }

  sendPushNotification = () => {
    let response = fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: this.state.token,
        priority: 'high',
        title: 'Door Sensor',
        body: 'Door has opened',
        channelId: 'door'
      })
    })
  }

  setModalVisible(visible, image='') {
    this.setState({modalVisible: visible, currentImage: image !== '' ? image.item.imageUrl : '' });
  }

  _getDates = () => {
    // Obtain JSON of friends
    return (<FlatList data={this.state.dates}
    renderItem={({ item }) => {
      return (<TouchableOpacity style={styles.friendBlock} onPress={() => {this.setModalVisible(!this.state.modalVisible, { item }) }}>
        <Image style={styles.avatarImg} source={{ uri: item.imageUrl }}/>
        <View style={{ paddingLeft: 5 }}>
          <Text>Timestamp:</Text>
          <Text>{new Date(parseInt(item.timeStamp*1000)).toDateString()} {new Date(parseInt(item.timeStamp*1000)).toLocaleTimeString()}</Text>
        </View>
      </TouchableOpacity>)
    }}
    keyExtractor={(item, index) => index.toString()}
    />)
  }

  render () {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}>
          <View style={{alignItems: 'center'}}>
            <Image style={{ width, height, resizeMode: 'contain', transform: [{ rotate: '180deg'}] }} source={{ uri: this.state.currentImage }}/>
            <TouchableOpacity style={ styles.modalDismissButton } onPress={() => {this.setModalVisible(!this.state.modalVisible) }}>
              <Text style={{ color: 'white' }}>Dismiss Image View</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.FriendContainer}>
          <ScrollView
            style={styles.ScrollContainer}
            showsVerticalScrollIndicator={true}
          >
            {this._getDates()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  FriendContainer: {
    marginTop: getStatusBarHeight(),
    width: '100%',
    height: '100%',
    flexDirection: 'column'
  },
  DirectionContainer: {
    padding: 5,
    width: '100%'
  },
  ScrollContainer: {
    flex: 1,
    flexDirection: 'column',
    borderTopWidth: 1,
    borderColor: 'lightgray',
    marginBottom: 50
    // marginBottom: Platform.OS === 'android' ? 50 : 0
  },
  friendBlock: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    height: '20%',
    width: width
  },
  avatarImg: {
    height: height * 0.1,
    width: width * 0.2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    transform: [{ rotate: '180deg'}]
  },
  optionBox: {
    alignItems: 'center',
    width: width * 0.9,
    height: '100%'
  },
  modalDismissButton: {
    marginTop: height*0.8,
    padding: 5,
    backgroundColor: 'black',
    color: 'black',
    borderWidth: 1,
    borderRadius: 10,
    position: 'absolute'
  }
})
