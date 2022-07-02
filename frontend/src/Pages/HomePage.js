import { React, useEffect } from "react";
import {useHistory} from 'react-router-dom'
import {Container,Box,Text} from '@chakra-ui/react'
import CustomTabs from '../components/Tabs/customTab'

const HomePage = () => {

  const history=useHistory();
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if(user) {
            history.push("/chats")   // if user is logged in push to chats page
        }
    },[history])

  return (
    <Container>
      <Box 
      d="flex"
      textAlign="center"
      p={3}
      bg="white"
      w="100%"
      m="40px 0 15px 0"
      borderRadius="lg"
      borderWidth="1px"
      >
      <Text fontSize="3xl" fontFamily="Montserrat" >Chatify</Text>
      </Box>
      <Box 
      bg={"white"}
      w="100%"
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      >
        <CustomTabs />
      </Box>
    </Container>
  )
}

export default HomePage