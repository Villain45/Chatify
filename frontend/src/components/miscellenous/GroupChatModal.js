import { Box, FormControl, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import {React,useState} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react'
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../userAvatar/UserListItem'
import UserBadgeItem from '../userAvatar/UserBadgeItem'

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]); //Users which are selected to display
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const {user ,chats ,setChats}=ChatState();

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
            })
            setLoading(false);
        }

    }

    const handleSubmit = async() => {
        if(!groupChatName || !selectedUsers) {
            toast({
                title:"Fill all the fields",
                status:"warning",
                duration: 5000,
                isClosable: true,
                position:"top"
            })
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const {data} = await axios.post("api/chat/group",{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((user) => user._id))
            },config)

            setChats([data,...chats])
            onClose();
            toast({
                title:"New Group Chat has been created",
                status:"success",
                duration: 5000,
                isClosable: true,
                position:"top"
            })
        } catch (error) {
            toast({
                title:"Failed to create chat",
                status:"error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
        }
    } 

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((selected)=>(
            selected._id!==delUser._id
        )))
    } 

    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)) {
            toast({
                title:"User already exists",
                status:"warning",
                duration: 5000,
                isClosable: true,
                position:"top"
            })
            return;
        }        
        setSelectedUsers([userToAdd,...selectedUsers])  //adds userToAdd in selectedUsers array
    }

  return (
    <>
    <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl> 
            {/* For creating the group chat */}
                <Input placeholder="Chat Name" mb={3} onChange={(e)=>setGroupChatName(e.target.value)} />
            </FormControl> 
            <FormControl> 
            {/* For adding users the group chat */}
                <Input placeholder="Add Users" mb={1} onChange={(e)=>handleSearch(e.target.value)} />
            </FormControl>

            <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((user)=>(
                    <UserBadgeItem key={user.id} user={user} handleFunction={()=> handleDelete(user)} /> //to delete the user if wanted the function is used
                ))}
            </Box>


            {loading ? (
                <Spinner my={3}/>      
            ):(
                searchResult?.slice(0,4).map((user)=>
                    <UserListItem key={user._id} user={user} handleFunction={()=> handleGroup(user)} />
                )
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default GroupChatModal