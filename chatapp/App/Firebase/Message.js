import Firebase from './FirebaseConfig'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'
import moment from 'moment'
export const SendMessage= async(currentUid,guestUid,message,image)=>{
        var todaydate= moment();
try{
        return await  database().ref('message/'+currentUid).
        child(guestUid)
        .push({
               message:{ 
                sender:currentUid,
                reciever:guestUid,
                message:message,
                image:image,
                date:todaydate.format('YYYY-MM-DD'),
                time:todaydate.format('hh:mm A')
                },
        })
}
catch(error)
{
    return error
}
}

export const RecieveMessage= async(currentUid,guestUid,message,image)=>{
        var todaydate= moment();

    try{
            return await  database().ref('message/'+guestUid).
            child(currentUid)
            .push({
                   message:{ 
                    sender:currentUid,
                    reciever:guestUid,
                    message:message,
                    image:image,
                     date:todaydate.format('YYYY-MM-DD'),
                time:todaydate.format('hh:mm A')
                    },
            })
    }
    catch(error)
    {
        return error
    }
    }
    