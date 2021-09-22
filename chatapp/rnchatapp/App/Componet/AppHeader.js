import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';

import Icon  from 'react-native-vector-icons/MaterialIcons';
export default class AppHeader extends Component {

    render() {
        const {title,onPress,navigation}=this.props
        return (
            <View style={{ height: 60, marginBottom: 20 }}>
                <View style={{padding: 5, backgroundColor: '#ffd31d' ,height:50}}>
                <View style={{flexDirection:'row'}}>
                        {
                            title=='Message'?
                                <View style={{width:'10%'}}>

                                </View>
                                :
                                <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                                <View style={{alignItems:'flex-start' ,marginVertical:8}}>
                                    <Icon name='arrow-back' size={25} color='#000'/>

                                </View> 
                                </TouchableOpacity>
                        }
                        <View style={{width:'80%',alignItems:'center',marginVertical:5}}>
                            <Text style={{...styles.textview,fontSize:20,fontWeight:'bold'}}>
                            {title}
                            </Text>
                        </View>
                        <View style={{width:'10%',alignItems:'flex-end',marginVertical:3}}>
                           {title==='Message'? <TouchableOpacity style={{...styles.iconView}} 
                            onPress={()=>{onPress()}}
                            >
                                    <Icon name='logout' size={25} color='#000'/>
                            </TouchableOpacity>:null}
                            
                        </View>
                        </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create( {
    gradient: {

    }
} )