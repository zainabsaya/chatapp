import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import AppHeader from '../Componet/AppHeader';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {updateUserImage} from '../Firebase/Users'
import ImgToBase64 from 'react-native-image-base64';

export default class Dashboard extends Component {
  state = {
    allusers: [],
    visible: false,
    imageurl:'',
    logginusername:''
  };
  async componentDidMount() {
    try {
      this.setState({visible: true});
      await database()
        .ref('users')
        .on('value', async(databasesnapshot) => {
          const uid = await AsyncStorage.getItem('UID');
          const id = auth().currentUser.uuid;
          console.log("id",id)
          console.log("Uid data",uid)
          
          let users = [];
          databasesnapshot.forEach(child => {
            console.log('child', child.val().uuid);
            if (child.val().uuid == uid) {
              console.log("logged in user name",child.val().name)
              this.setState({logginusername:child.val().name,imageurl:child.val().image})
            } else {
              console.log('data', child.val().name);
              users.push({
                username: child.val().name,
                uid: child.val().uuid,
                imageurl:child.val().image,
              });
            }
          });
          this.setState({allusers: users, visible: false});
        });
    } catch (err) {
      console.log(err);
      this.setState({visible: false});
    }
  }
  openGallery = ()=>{
      launchImageLibrary('photo',(res)=>{
        this.setState({imageurl:res.assets[0].uri})
        console.log("response image piker",res.assets[0].uri)

        ImgToBase64.getBase64String(res.assets[0].uri)
        .then(async(base64String) => {
          const uid = await AsyncStorage.getItem('UID');
          let source = 'data:image/jpeg;base64,'+base64String;
          updateUserImage(source,uid).then(()=>{
            this.setState({imageurl:res.assets[0].uri})
          })

        })
        .catch(err =>console.log(err));
      })
  }
  Logout = () => {
    auth()
      .signOut()
      .then(async res => {
        await AsyncStorage.removeItem('UID');
        this.props.navigation.navigate('LogIn');
        console.log('res', res);
      });
  };
  render() {
    console.log('allusers', this.state.allusers);
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <AppHeader
          title={'Message'}
          navigation={this.props.navigation}
          onPress={() => this.Logout()}
        />
        <FlatList
          alwaysBounceVertical={false}
          data={this.state.allusers}
          style={{padding: 5}}
          keyExtractor={(_, index) => {
            index.toString();
          }}
          ListHeaderComponent={
            <View style={{height:160,justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity style={{height:90,width:90,borderRadius:45}} onPress={()=>{this.openGallery()}}>
              <Image  style={{
                      height: 90,
                      width: 90,
                      borderRadius: 90 / 2,
                    }} source={{uri:this.state.imageurl===''?'https://images.unsplash.com/photo-1518568740560-333139a27e72?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80':this.state.imageurl}}/>
              <Text style={{color:'#fff',fontSize:20,marginTop:20,fontWeight:'bold'}}>{this.state.logginusername}</Text>
            </TouchableOpacity>
            </View>
          }
          renderItem={({item}) => (
            <View>
              <TouchableOpacity style={{flexDirection: 'row',marginVertical:20}} onPress={()=>this.props.navigation.navigate('Chat',{username:item.username,guestUid:item.uid})} >
                <View
                  style={{
                    width: '15%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 50 / 2,
                    }}
                      source={{uri:item.imageurl===''?'https://images.unsplash.com/photo-1518568740560-333139a27e72?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80':item.imageurl}}
                  />
                </View>
                <View
                  style={{
                    width: '85%',
                    alignItems: 'flex-start',
                    marginHorizontal: 10,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                    {item.username}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{borderWidth: 0.2, borderColor: '#fff',elevation:5}} />
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={() => {
                this.Logout();
              }}>
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                Logout
              </Text>
            </TouchableOpacity>
          }
        />
        <Spinner
          visible={this.state.visible}
          textContent={'Loadding...'}
          color={'yellow'}
        />
      </View>
    );
  }
}
