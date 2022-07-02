const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage =asyncHandler(async(req,res) => {
    // we need chatid , messagetobesent , who is the sender for each message sent [sender can be got from protect middleware]
    const { content, chatId } = req.body;

    if(!content || !chatId) {
        console.log("Invalid data sent into request");
        return res.statusCode(400);
    }

    var newMessage = {  //check message model 
        sender:req.user._id,
        chat:chatId,
        content:content
    }

    try {
        var message = await Message.create(newMessage)

        message = await message.populate("sender","name pic"); //for sender only populate name pic
        message = await message.populate("chat"); //everything is populated for chat 
        message = await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })
        
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        }) //everytime the message is sent the new message is updated in latest message[check by sending a message through postman by api/message and check in fetching chats]

        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

const allMessages = asyncHandler(async(req, res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId})  //since chatId was given as parameter in messageRoutes
        .populate("sender","name pic email")
        .populate("chat")

        res.json(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

module.exports = {sendMessage,allMessages}