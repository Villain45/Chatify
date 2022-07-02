import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { BsSearch } from 'react-icons/bs'
import {ChatState} from "../../Context/ChatProvider"
import {useHistory} from 'react-router-dom'
import React, { useState } from 'react'
import ProfileModal from './ProfileModal'
import { useDisclosure } from '@chakra-ui/hooks'
import ChatLoading from '../ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
import axios from 'axios'
import {getSender} from '../../config/ChatLogic'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';

const SideBar = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setloadingChat] = useState();
    const history =useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user , setSelectedChat ,chats, setChats, notification, setNotification } = ChatState(); //Getting user from context

    const logoutHandler = () => {
      localStorage.removeItem("userInfo");
      history.push("/");
    }

    const accessChat = async(userId) => {
      try {
        setloadingChat(true);

        const config = {
          headers: {
            "Content-type" : "application/json",
            Authorization : `Bearer ${user.token}`
          }
        }

        const { data } = await axios.post("api/chat",{userId},config)
        
        //what if the chat is already rendered on MyChats then except that render all the chats in sideBar
        if(!chats.find((c)=> c._id === data._id)) {
          setChats([data,...chats]) // ... refers to appending the data in chats
        }

        setSelectedChat(data);
        setloadingChat(false);
        onClose();
      } catch (error) {
        toast({
          title:"Error in fetching the Chat",
          description:error.message,
          status:"error",
          duration: 5000,
          isClosable: true,
          position:"bottom-left"
        })
      }
    }

    const toast = useToast();

    const handleSearch = async() => {
      if(!search) {
        toast({
          title:"Please enter a search",
          status:"error",
          duration:5000,
          isClosable: true,
          position:"top-left"
        })    
      }

      try {
        setLoading(true);

        const config = {
          headers:{
            Authorization:`Bearer ${user.token}`
          },
        }

        const { data } = await axios.get(`api/user?search=${search}`,config);

        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title:"Error Occurred",
          description:"Failed to load the result",
          status:"error",
          duration:5000,
          isClosable: true,
          position:"bottom-left"
        })
      }
    }
  return (
    <>
        <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"      
        borderWidth="5px"
        >
            <Tooltip hasArrow label='Search users' bg='gray.300' color='black'>
              <Button variant="ghost" onClick={onOpen}>
                <BsSearch/>
                <Text display={{base:"none",md:"flex"}} px="4">
                  Search users
                </Text>
              </Button>
            </Tooltip>
            <Text fontSize="2xl" fontFamily="Work sans">
              Chatify
            </Text>
            <div>
              <Menu>
                <MenuButton m={2}>
                  <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}
                  />
                  <BellIcon fontSize="2xl" m={1}/>
                </MenuButton>
                <MenuList p={2}>
                  {!notification.length && "No New Messages"}
                  {notification.map(notif=>(
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat)
                        setNotification(notification.filter((n)=>n!==notif))
                      }}
                    >
                      {notif.chat.isGroupChat ? `Message in ${notif.chat.chatName}` 
                      :
                      `Message from ${getSender(user,notif.chat.users)}`
                      }
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                  <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                </MenuButton>
                <MenuList>
                  <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>
                  </ProfileModal>
                  <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
                </MenuList>
              </Menu>

            </div>
        </Box>

        <Drawer placement='left' isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay/>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input 
                  placeholder="Search User by name"
                  mr={2}
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? 
              <ChatLoading/> : (
              searchResult?.map((user) =>(
                  <UserListItem 
                  key={user._id}
                  user={user}
                  handleFunction={()=> accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml="auto" display="flex"/>}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
              
          
    </>
  )
}

export default SideBar