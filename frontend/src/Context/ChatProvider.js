/* Context is used so that a "useState" used in one page can be accessed from other pages too */
//Export and Add it in index.js so that whatever is created would be accessed from whole app

import { createContext, useEffect, useState,useContext } from "react";
import {useHistory} from 'react-router-dom'
const ChatContext = createContext();

const ChatProvider = ({children}) => {  // children refers to whole app
    const [user,setUser] = useState();
    const [selectedchat, setSelectedChat] = useState();
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])
    const history=useHistory();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo) {
            history.push('/')   // if user is not logged in
        }
    },[history])  //runs whenever history changes
    
    //just pass the values of state to be accessed from everywhere
    return (<ChatContext.Provider value={{user,setUser,selectedchat, setSelectedChat ,chats, setChats,notification, setNotification}}>     
            {children}
            </ChatContext.Provider>
    )
}
export const ChatState = () =>{
        return useContext(ChatContext)
}

export default ChatProvider;