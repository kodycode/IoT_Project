import React from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { ScrollView, Dimensions, Platform, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';

export default class App extends React.Component {
  _getFriendList = () => {
    // Obtain JSON of friends
    return (<FlatList data={[
      { timestamp: 'Time1' },
      { timestamp: 'Time2' },
      { timestamp: 'Time3' },
      { timestamp: 'Time4' },
      { timestamp: 'Time5' },
      { timestamp: 'Time6' },
      { timestamp: 'Time7' },
      { timestamp: 'Time8' },
      { timestamp: 'Time9' },
      { timestamp: 'Time10' },
      { timestamp: 'Time11' }
    ]}
    renderItem={({ item }) => {
      return (<TouchableOpacity style={styles.friendBlock}>
        <View style={styles.avatarImg}>
        </View>
        <View style={{ paddingLeft: 5 }}>
          <Text style={styles.TextStyle}>Timestamp: {item.timestamp}</Text>
          <Text style={styles.TextStyle}>Bedroom Door</Text>
        </View>
      </TouchableOpacity>)
    }}
    keyExtractor={(item, index) => index.toString()}
    />)
  }

  render () {
    return (
      <View>
        <View style={styles.FriendContainer}>
          <ScrollView
            style={styles.ScrollContainer}
            showsVerticalScrollIndicator={true}
          >
            {this._getFriendList()}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const { width, height } = Dimensions.get('screen')

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
  TextStyle: {

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
    backgroundColor: 'black',
    height: height * 0.1,
    width: width * 0.2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  optionBox: {
    alignItems: 'center',
    width: width * 0.9,
    height: '100%'
  },
  optionBubbleStyle: {
    fontFamily: 'gotham-medium',
    fontSize: 40,
    transform: [{ rotate: '90deg' }]
  }
})
