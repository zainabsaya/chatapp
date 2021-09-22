import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {AddUser} from '../Firebase/Users';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      visible: false,
    };
  }

  async componentDidMount() {
    
    this.setState({visible: true});
    const uid = await AsyncStorage.getItem('UID');
    if (uid) {
      this.props.navigation.navigate('Dashboard');
      
      this.setState({visible: false});
    }
    this.setState({visible: false});
  }

  LoginToFirenbase =  () => {
    this.setState({visible: true});

    auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(async(res) => {
        console.log('User signed in anonymously', res);
        const uid = auth().currentUser.uid;
        await AsyncStorage.setItem('UID', uid);

        this.setState({visible: false});
        this.props.navigation.navigate('Dashboard');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
          this.setState({visible: false});
        }
        this.setState({visible: false});
        console.error(error);
      });
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
        }}>
        <Image
          source={require('../images/zlogo.jpg')}
          style={{width: '30%', height: '30%', borderRadius: 30}}
        />
        <View style={{...styles.maincontainer, backgroundColor: '#ccc'}}>
          <TextInput
            placeholder="Enter your email"
            style={{...styles.textInput, fontSize: 17}}
            onChangeText={text => this.setState({email: text})}
            placeholderTextColor="#000"
            value={this.state.email}
          />
        </View>
        <View style={{...styles.maincontainer, backgroundColor: '#ccc'}}>
          <TextInput
            placeholder="Enter your password"
            style={{...styles.textInput, fontSize: 17}}
            onChangeText={pass => this.setState({password: pass})}
            placeholderTextColor="#000"
            value={this.state.password}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            this.LoginToFirenbase();
          }}
          style={{
            backgroundColor: '#ffd302',
            width: 322,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}>
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Register')}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
            New User? click hear
          </Text>
        </TouchableOpacity>
        <Spinner
          visible={this.state.visible}
          textContent={'Loadding...'}
          color={'yellow'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  maincontainer: {
    justifyContent: 'center',
    borderRadius: 5,
    height: 50,
    marginBottom: 10,
    width: '90%',
  },
  textInput: {
    paddingHorizontal: 10,
    width: '90%',
    paddingVertical: 10,
    color: '#000',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
});
