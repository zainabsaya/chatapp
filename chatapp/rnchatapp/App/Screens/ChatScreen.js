import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {AddUser} from '../Firebase/Users';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from '../Componet/AppHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SendMessage, RecieveMessage} from '../Firebase/Message';
import database from '@react-native-firebase/database';
import ImgToBase64 from 'react-native-image-base64';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      currentUid: '',
      guestUid: '',
      allMessage: [],
      visible: false,
    };
  }
  async componentDidMount() {
    const currentUid = await AsyncStorage.getItem('UID');
    const guestUid = this.props.navigation.getParam('guestUid');
    this.setState({
      currentUid: currentUid,
      guestUid: guestUid,
    });

    try {
      database()
        .ref('message')
        .child(currentUid)
        .child(guestUid)
        .on('value', snapshot => {
          let message = [];
          snapshot.forEach(data => {
            message.push({
              sendby: data.val().message.sender,
              reciveby: data.val().message.reciever,
              message: data.val().message.message,
              image: data.val().message.image,
              date: data.val().message.date,
              time: data.val().message.time,
            });
          });
          this.setState({
            allMessage: message.reverse(),
          });
          console.log('all message', this.state.allMessage);
        });
    } catch (error) {
      conole.log(error);
    }
  }
  sendmsg = async () => {
    if (this.state.message) {
      SendMessage(
        this.state.currentUid,
        this.state.guestUid,
        this.state.message,
        '',
      )
        .then(() => {
          this.setState({message: ''});
        })
        .catch(error => {
          alert(error);
        });

      RecieveMessage(
        this.state.currentUid,
        this.state.guestUid,
        this.state.message,
        '',
      )
        .then(() => {
          this.setState({message: ''});
        })
        .catch(error => {
          alert(error);
        });
    }
  };
  openGallery = () => {
    launchImageLibrary('photo', res => {
      this.setState({visible: true});

      ImgToBase64.getBase64String(res.assets[0].uri)
        .then(async base64String => {
          let source = 'data:image/jpeg;base64,' + base64String;
          SendMessage(this.state.currentUid, this.state.guestUid, '', source)
            .then(() => {
              this.setState({visible: false});
            })
            .catch(error => {
              this.setState({visible: false});
              alert(error);
            });

          RecieveMessage(this.state.currentUid, this.state.guestUid, '', source)
            .then(() => {
              this.setState({visible: false});
            })
            .catch(error => {
              this.setState({visible: false});
              alert(error);
            });
        })
        .catch(err => console.log(err));
      this.setState({visible: false});
    });
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <AppHeader
          title={this.props.navigation.getParam('username')}
          navigation={this.props.navigation}
          onPress={() => this.Logout()}
        />
        <FlatList
          inverted
          style={{marginHorizontal: 10, marginVertical: 60}}
          data={this.state.allMessage}
          keyExtractor={index => {
            index.toString();
          }}
          renderItem={({item}) => (
            <View
              style={{
                maxWidth: Dimensions.get('window').width / 2 + 10,
                alignSelf:
                  this.state.currentUid === item.sendby
                    ? 'flex-end'
                    : 'flex-start',
              }}>
              <View
                style={{
                  borderRadius: 20,
                  marginVertical: 10,
                  backgroundColor:
                    this.state.currentUid === item.sendby ? '#fff' : '#ccc',
                }}>
                {item.image === '' ? (
                  <Text style={{padding: 10, fontSize: 16, fontWeight: 'bold'}}>
                    {item.message}
                    {'   '}
                    <Text style={{fontSize: 10, fontWeight: 'normal'}}>
                      {item.time}
                    </Text>
                  </Text>
                ) : (
                  <View>
                    <Image
                      source={{uri: item.image}}
                      style={{height: 150, width: 150, borderRadius: 10}}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        position: 'absolute',
                        bottom: 5,
                        right: 5,
                      }}>
                      {item.time}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        />
        <View
          style={{
            bottom: 0,
            height: 50,
            width: 100,
            position: 'absolute',
            flexDirection: 'row',
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
            style={{width: '20%', justifyContent: 'center'}}
            onPress={() => this.openGallery()}>
            <Icon name="camera" size={25} color="#fff" />
          </TouchableOpacity>
          <View style={{width: 300, justifyContent: 'center'}}>
            <TextInput
              placeholder="Enter Message"
              placeholderTextColor="#000"
              onChangeText={text => this.setState({message: text})}
              style={{
                height: 40,
                width: 280,
                borderRadius: 50,
                backgroundColor: 'white',
                marginHorizontal: 5,
                paddingLeft: 10,
              }}
              value={this.state.message}
            />
          </View>
          <TouchableOpacity
            style={{width: '70%', justifyContent: 'center'}}
            onPress={() => this.sendmsg()}>
            <Icon name="send" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <Spinner
          visible={this.state.visible}
          textContent={'Loadding...'}
          color={'yellow'}
        />
      </View>
    );
  }
}
