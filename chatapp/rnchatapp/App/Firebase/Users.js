import Firebase from './FirebaseConfig'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'

export const AddUser= async(name,email,image,uid)=>{
try{
        return await  database().ref('users/'+uid).
        set(
            {name:name,
            email:email,
            image:image,
            uuid:uid
        }
        )
}
catch(error)
{
    return error
}
}


export const updateUserImage= async(image,uid)=>{
    try{
            return (await  database().ref('users/'+uid).
           update(
               {
                    image:image,
               }
           ),console.log("update"))
           
            
    }
    catch(error)
    {
        return error
    }
    }