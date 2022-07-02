import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, Image, Text } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
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
import React from 'react'

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
        {children ? (
            <span onClick={onOpen}>{children}</span>
        ): (
            <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}></IconButton>
        )}
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="20px"
                        fontFamily="Work sans"                         
                        display="flex"
                        justifyContent="center"
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image 
                            borderRadius="full"
                            boxSize="150px"
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text p="20px" fontSize="2xl">
                            Email: {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
        </Modal>
    </>
  )
}

export default ProfileModal