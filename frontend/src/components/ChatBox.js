import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import SingleChat from '../components/SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {

  const {selectedchat} = ChatState();  //to display the selected chat in mychats option

  return (
    <Box
      display={{base: selectedchat ? "flex" : "none" , md:"flex"}}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{base:"100%",md:"68%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox