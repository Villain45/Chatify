import { Box } from "@chakra-ui/react";
import {ChatState} from "../Context/ChatProvider"
import SideBar from "../components/miscellenous/SideBar"
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { useState } from "react";

const ChatPage = () => { 
   const {user} = ChatState(); //Getting user from context
   const [fetchAgain, setFetchAgain] = useState(false) //if u leave group this helps to the chat list in mychats page

  return (
    <div style={{width: "100%"}}>
    {user && <SideBar/>}
    <Box display="flex" justifyContent='space-between' w="100%" h="91.5vh" p="10px">
    {/* u can send states using the below method for any single pages but if u want to use to whole application then useContext will help */}
      {user && <MyChats fetchAgain = {fetchAgain}/>}
      {user && <ChatBox fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain}/>} 
    </Box>
    </div>
  )
}

export default ChatPage