import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import {React ,useEffect,useState} from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import {getSender} from '../config/ChatLogic'
import GroupChatModal from './miscellenous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const {user,selectedchat, setSelectedChat ,chats, setChats} = ChatState();

  const toast = useToast();
  
  const fetchChats = async() => {
    try {
      const config = {
        headers: {
          Authorization : `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get("api/chat",config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load chats",
        status:"error",
        duration: 5000,
        isClosable: true,
        position:"bottom-left"
      })
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    //eslint-disable-next-line
  },[fetchAgain])


  return (
    <Box
      display={{base:selectedchat? "none" : "flex" , md:"flex"}}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{base:"100%" , md:"31%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{base:"28px" , md:"30px"}}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{base:"17px", md:"10px" ,lg:"17px"}}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats? (
          <Stack overflowY='scroll'>
            {chats.map((chat)=>(
              <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedchat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedchat === chat ? "white" : "black"}
              px={3}
              py={3}
              borderRadius="lg"
              key={chat._id}
              >
                <Text>
                  {/* getSender is used bcoz if user is logged in then except him name of other chat must be displayed not himself*/}
                  {/* isGroupChat consists of name of the chat user by default it is "SENDER" otherwise it is senders name */}
                  {!chat.isGroupChat ? getSender(loggedUser , chat.users) : chat.chatName}  
                  {/* some scroll things will be displayed to be remove it code is added in App.css*/}
                </Text>
              </Box>
            ))}
          </Stack>
        ): (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats