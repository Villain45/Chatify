import { Box, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,Text
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'

const UpdateGroupChatModel = ({fetchAgain, setFetchAgain , fetchMessages}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const {user, selectedchat, setSelectedChat} = ChatState();

    const toast = useToast();

    //These states are same as that of GroupChatModal.js
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading,setRenameLoading] = useState(false) //loading from rename of the chat

    const handleRemove = async(userToRemove) => {
      if(selectedchat.groupAdmin._id!==user._id && userToRemove._id!== user._id) {
        toast({
          title:"Only Admins can remove someone!",
          status:"error",
          duration: 5000,
          isClosable: true,
          position:"bottom"
        })
        return
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization : `Bearer ${user.token}`
          }
        }

        const { data } = await axios.put("api/chat/groupremove",{
          chatId: selectedchat._id,
          userId:userToRemove._id
        },config)

        userToRemove._id === user._id ? setSelectedChat() :setSelectedChat(data);
        //the above is done so that if user leaves the group we make so that he cant see the chats in the group

        setFetchAgain(!fetchAgain)
        fetchMessages(); //inputted from single chat so that when user is removed all chats get refreshed
        setLoading(false);
        
        if(userToRemove._id===user._id) {
          toast({
          title:"You left the group",
          status:"success",
          duration: 5000,
          isClosable: true,
          position:"top"
        })
        }
        else{
          toast({
          title:"User has been removed from the group",
          status:"success",
          duration: 5000,
          isClosable: true,
          position:"top"
        })
        }
      } catch (error) {
        toast({
          title:"Only Admins can remove someone!",
          description:error.response.data.message,
          status:"error",
          duration: 5000,
          isClosable: true,
          position:"bottom"
        })
      }
    }

    const handleAddUser = async(eachUser) => {
      if(selectedchat.users.find((u)=>u._id === eachUser._id)) {
        toast({
          title:"User already exists",
          status:"error",
          duration: 5000,
          isClosable: true,
          position:"bottom"
        })
        return;
      }
      //user is logged in user
      if(selectedchat.groupAdmin._id !== user._id) {
        toast({
          title:"Only Admins can add someone!",
          status:"error",
          duration: 5000,
          isClosable: true,
          position:"bottom"
        })
      }

      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

        const {data} = await axios.put("api/chat/groupadd",{
          chatId:selectedchat._id,
          userId:eachUser._id //user to be added
        },config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain)
        setLoading(false);
      } catch (error) {
        toast({
          title:"Error Occurred",
          description:error.response.data.message,
          isClosable: true,
          status:"error",
          duration:5000,
          position:"bottom"
        })
        setLoading(false);
      }
    }

    const handleRename = async() => {
      if(!groupChatName)
      return;

      try {
        setRenameLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

        const {data} = await axios.put('api/chat/rename',{
          chatId: selectedchat._id,
          chatName: groupChatName
        },config)

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      } catch (error) {
        toast({
          title:"Error Occurred",
          description:error.response.data.message,
          isClosable: true,
          status:"error",
          duration:5000,
          position:"bottom"
        })
        setRenameLoading(false);
      }

      setGroupChatName("");
    }

    const handleSearch = async(query) => { //Query contains the list of users
        setSearch(query);
        if(!query){
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            }
            
            const { data } = await axios.get(`api/user?search=${search}`,config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title:"Error Occurred",
                description:"Failed to load search results",
                status:"error",
                duration: 5000,
                isClosable: true,
                position:"bottom-left"
            });
            setLoading(false);  
        }

    }


  return (
    <>
    <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            fontSize="25px"
            fontFamily="Work sans"
            justifyContent="center"
          >{selectedchat.chatName.toUpperCase()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                <Text fontSize="27px" w="100%">Group Members :</Text>
                {selectedchat.users.map((u)=>(
                    <UserBadgeItem 
                    key={user._id}
                    user={u}
                    handleFunction={()=>handleRemove(u)}
                    />
                ))}
            </Box>
            <FormControl display="flex">
                <Input
                    placeholder="Rename Group"
                    mb={3}
                    value={groupChatName}
                    onChange={(e)=>setGroupChatName(e.target.value)}
                />
                <Button
                    variant="solid"
                    colorScheme="teal"
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                >
                    Update
                </Button>
            </FormControl>
            <FormControl> 
            {/* For adding users the group chat */}
                <Input placeholder="Add Users" mb={1} onChange={(e)=>handleSearch(e.target.value)} />
            </FormControl>
            {loading ? (
                console.log("H")     
            ):(
              
                searchResult?.slice(0,4).map((user)=>
                    <UserListItem key={user._id} user={user} handleFunction={()=> handleAddUser(user)} />
                )
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={()=>handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModel