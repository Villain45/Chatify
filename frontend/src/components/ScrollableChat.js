import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender ,isSameUserMargin ,isSameUser} from '../config/ChatLogic'
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({messages}) => {

  const { user } = ChatState(); 

  return (
    <ScrollableFeed>
        {messages && messages.map((msg,idx) =>(
            <div style={{ display:"flex" }} key={msg._id}>
              {(isSameSender(messages,msg,idx,user._id) || isLastMessage(messages,idx,user._id)) && (
              <Tooltip
                label={msg.sender.name} placement="bottom-start" hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={msg.sender.name}
                  src={msg.sender.pic}
                />
              </Tooltip> 
              )}
              {/* For messages to be displayed on screen */}

              <span style={{backgroundColor : `${msg.sender._id===user._id ? "#00ad1d" : "#544c4c" }`,
              color : "white",
              borderRadius:"10px",
              padding:"5px 15px",
              maxWidth:"75%", 
              marginLeft: isSameUserMargin(messages,msg,idx,user._id),
              marginTop: isSameUser(messages,msg,idx) ? 3 : 10}}>
                {msg.content}
              </span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat