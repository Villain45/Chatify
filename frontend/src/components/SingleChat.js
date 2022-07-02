import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import {getSender,getSenderFullObject} from '../config/ChatLogic'
import ProfileModal from './miscellenous/ProfileModal';
import UpdateGroupChatModel from './miscellenous/UpdateGroupChatModel';
import axios from 'axios'
import './styles.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000/'
var socket,selectedChatCompare;


const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const toast = useToast();

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const {user,selectedchat,setSelectedChat,notification, setNotification}= ChatState();
    
    useEffect(() => {
      socket = io(ENDPOINT,{ transports : ['websocket'] }); //transports was added for cors error
      socket.emit("setup",user);
      socket.on("connection",()=>setSocketConnected(true))
      socket.on("typing",()=>setIsTyping(true))
      socket.on("stop typing",()=>setIsTyping(false))
    },[])


    
    const fetchMessages = async() => { //fetching all chats from a selecteduser
        if(!selectedchat) return;
        
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`api/message/${selectedchat._id}`,config)
            setMessages(data);
            setLoading(false);

            socket.emit("join chat",selectedchat._id)
        } catch (error) {
            toast({
                    title:"Error Occured!",
                    description:"Failed to fetch all Messages",
                    status:"error",
                    duration: 5000,
                    isClosable:true,
                    position:"top"
                })
        }
    }
    
        // whenever we switch the user chat gets fetched according to the selecteed user or group chat 
    useEffect(() => { 
      fetchMessages();
      selectedChatCompare=selectedchat //just to keep a copy of the selected chat
    }, [selectedchat])

    // for a single message to send 
    const sendMessage = async(event) => {
        if(event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization : `Bearer ${user.token}`
                    }
                }

                setNewMessage("") // placed up bcoz when we press enter the input should be cleared as soon as possible
                const { data } = await axios.post("api/message",{
                    content:newMessage,
                    chatId:selectedchat._id
                },config)

                socket.emit("new message",data)
                
                setMessages([...messages,data])
            } catch (error) {
                toast({
                    title:"Error Occured!",
                    description:"Failed to send a Message",
                    status:"error",
                    duration: 5000,
                    isClosable:true,
                    position:"top"
                })
            }
        }
    }    
    
    
    useEffect(() => {  //for receiving message [have to send first in sendMessage function]
      socket.on("message recieved",(newMessageReceived) => {
          if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
              if(!notification.includes(newMessageReceived)) { //notification
                  setNotification([newMessageReceived,...notification]);
                  setFetchAgain(!fetchAgain)
              }
          }
          else {
              setMessages([...messages,newMessageReceived])
          }
      })
    })

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if(!socketConnected) return;

        if(!typing)
        {
            setTyping(true);
            socket.emit("typing",selectedchat._id)
        }
        let LastTypingTime = new Date().getTime();
        var timerLength = 3000
        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - LastTypingTime

            if(timeDiff>=timerLength && typing) {
                socket.emit("stop typing",selectedchat._id)
                setTyping(false);
            }

        },timerLength)
    }
  return (
    <>
        {selectedchat ? (
            <>
                <Text
                    fontSize={{base:"25px" ,md:"30px"}}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{base:"space-between"}}
                    alignItems="center"
                >
                    <IconButton
                        display={{base:"flex" ,md:"none"}}
                        icon={<ArrowBackIcon/>}
                        onClick={()=>setSelectedChat("")}
                    />
                    {!selectedchat.isGroupChat ? ( //if it is not a group chat
                        <>
                            {getSender(user,selectedchat.users)}
                            <ProfileModal user={getSenderFullObject(user,selectedchat.users)}/>
                        </>
                    ):(
                        <>
                            {selectedchat.chatName.toUpperCase()}
                            <UpdateGroupChatModel fetchAgain= {fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                        </>
                    )}
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                >
                    {loading ? (
                        <Spinner
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto"
                        />
                    ):(
                        <div className="messages">
                            <ScrollableChat messages={messages} />
                        </div>
                    )}

                    <FormControl isRequired onKeyDown={sendMessage} mt={3}>
                    {isTyping && selectedchat.isGroupChat ? 
                        <div className="typing">
                            someone is typing...
                        </div> : 
                        <>
                            {isTyping && !selectedchat.isGroupChat ? <div className="typing">typing...</div> : <></>}
                        </>}  
                        
                        <Input
                            variant="filled"
                            bg="#E0E0E0"
                            placeholder="Enter a message"
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        )
        : (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="100%"
            >
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on any user to start Chatting.....
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat