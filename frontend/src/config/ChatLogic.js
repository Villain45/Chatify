export const getSender = (loggedUser , users) =>{
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}
export const getSenderFullObject = (loggedUser , users) =>{
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}

export const isSameSender = (messages,m,i,userId) => { // to display image for the user while sending the message
    // m=current message i=index of current message
    return (
        i<messages.length-1 && 
        (messages[i+1].sender._id !== m.sender._id ||
            messages[i+1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    )
}

export const isLastMessage = (messages,i,userId) => {
    return (
        i === messages.length -1 &&
        messages[messages.length-1].sender._id !== userId &&  // should not be logged in user
        messages[messages.length-1].sender._id  //should not be empty
    )
}


export const isSameUserMargin = (messages , m , i , userId) => {
    if(//receiver messages
        i<messages.length-1 && 
        (messages[i+1].sender._id === m.sender._id  &&
        messages[i].sender._id !== userId))
    return 33;
    else if ( //sender messages
        (i<messages.length-1 && 
            messages[i+1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) || 
        (i===messages.length-1 && messages[i].sender._id !== userId))
    return 0; 
    else return "auto"
}

export const isSameUser = (messages,m,i)=>{
    return i>0 && messages[i-1].sender._id === messages[i].sender._id //upar ka niche ka message same ho tho
}