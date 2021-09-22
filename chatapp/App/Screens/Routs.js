import React from 'react';
import {createAppContainer,createStackNavigator,createSwitchNavigator} from 'react-navigation'
import {
  Text,
  View,
} from 'react-native';
import LogIn from './LogIn'
import Register from './Register';
import Dashboard from './Dashboard';
import Chat from './ChatScreen';
const Authstack= createStackNavigator({
      LogIn:LogIn,
      Register:Register,
},{
  headerMode:'none',initialRouteName:'LogIn'
})

const Dashboardscreen= createStackNavigator({
  Dashboard:Dashboard,
  Chat:Chat
},{
headerMode:'none',initialRouteName:'Dashboard'
})
const App = createSwitchNavigator({
  Auth:Authstack,
  Dashboardscreen:Dashboardscreen,
},
{initialRouteName:'Auth'})
export default createAppContainer(App)