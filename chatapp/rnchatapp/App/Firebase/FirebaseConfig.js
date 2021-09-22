import  Firebase from '@react-native-firebase/app'
    

const firebaseconfig ={
apikey:"AIzaSyB369zXs1aerP1Rb2eoygPKskmawZQNTxU",
databseurl:"https://rnchatapp-38460-default-rtdb.firebaseio.com/",
projectId:'rnchatapp-38460',
appId:'1:189674066572:android:92ae3c4390a1c574d821a9',
}

export default Firebase.initializeApp(firebaseconfig)