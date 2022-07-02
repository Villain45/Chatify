import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box
        px={2}
        py={2}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize="15px"
        backgroundColor="purple"
        color="white"
        cursor="pointer"
        onClick={handleFunction}
    >
        {user.name.toUpperCase()}
        <CloseIcon isCentered ml={2} fontSize="10px"/>
    </Box>
  )
}

export default UserBadgeItem