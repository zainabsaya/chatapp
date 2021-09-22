import React, {Component} from 'react';
import {Text, View, StyleSheet, TextInput,TouchableOpacity,Image} from 'react-native';
import auth from '@react-native-firebase/auth'
import { AddUser } from '../Firebase/Users';

export default class Register extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      password: '',
    };
  }
  SignUpToFirenbase = ()=>{
    auth()
    .createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      console.log('User account created & signed in!');
      this.props.navigation.navigate('LogIn')
      const  userId =auth().currentUser.uid;
      console.log(userId)
      AddUser(this.state.name,this.state.email,'',userId).then((res)=>{
        console.log("response",res)
      }).catch((error)=>{
        console.log(error)
      })
        
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
  
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
  
      console.error(error);
    });

   

  }
  render() {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'black'}}>
        <Image source={require('../images/zlogo.jpg')} style={{width:"30%",height:"30%",borderRadius:30}}/>
      <View style={{...styles.maincontainer, backgroundColor: '#ccc'}}>
        <TextInput
          placeholder="Enter your name"
          style={{...styles.textInput, fontSize: 17}}
          onChangeText={(email) => this.setState({name: email})}
          placeholderTextColor='#000'
          value={this.state.name}
        />
        </View>
        <View style={{...styles.maincontainer, backgroundColor: '#ccc'}}>
        <TextInput
          placeholder="Enter your email"
          style={{...styles.textInput, fontSize: 17}}
          onChangeText={(text) => this.setState({email: text})}
          placeholderTextColor='#000'
          value={this.state.email}
        />
        </View>
        <View style={{...styles.maincontainer, backgroundColor: '#ccc'}}>
        <TextInput
          placeholder="Enter your password"
          style={{...styles.textInput, fontSize: 17}}
          onChangeText={(pass) => this.setState({password: pass})}
          placeholderTextColor='#000'
           value={this.state.password}
           secureTextEntry={true}
        />

      </View>
      <TouchableOpacity onPress={()=>{this.SignUpToFirenbase()}} style={{backgroundColor:'#ffd302',width:322,height:40,alignItems:'center',justifyContent:'center',borderRadius:5}}>
          <Text>
            Sign Up
          </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>this.props.navigation.navigate('LogIn')}>
          <Text style={{color:'#fff',fontSize:16,fontWeight:'bold'}}> Have Account? clicl hear</Text>
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({

    maincontainer:{
        justifyContent:'center',
        borderRadius:5,
        height:50,
        marginBottom:10,
        width:'90%'
    },
    textInput:{
        paddingHorizontal:10,
        width:'90%',
        paddingVertical:10,
        color:'#000',

    },
    button:{
      justifyContent:'center',
      alignItems:'center',
      borderWidth:2,
      borderColor:'black'
    }
})