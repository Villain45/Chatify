const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


//API for the Chat to access fetch creategroup renameGroup addTo removeFrom
const accessChats = asyncHandler(async(req,res)=>{
    const {userId} = req.body
    if(!userId)
    {
        console.log("UserID is not sent with params");
        return res.statusCode(400);
    }

    var isChat=await Chat.find({
        isGroupChat: false,
        $and:[
            {users : {$elemMatch : {$eq: req.user._id}}},
            {users : {$elemMatch : {$eq: userId}}}
        ]
    }).populate("users","-password").populate("latestMessage")

    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email"
    })

    if(isChat.length>0)
    {
        res.send(isChat[0]);   //only one chat exists for isChat var
    }
    else
    {// else create a chatgroup
        var chatData={
            chatName: "sender",
            isGroupChat: false,
            users:[req.user._id,userId] 
        };

        try {
            const createdChat= await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users","-password")
            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
})

const fetchChats= asyncHandler(async(req, res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async (results)=>{
            results = await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email"
            })
            res.status(200).send(results)
        })
        }
     catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const createGroupChat = asyncHandler(async(req, res)=>{
    if(!req.body.users || !req.body.name) {   //to check whether name of group and people to be added is given or not
        return res.status(400).send({message:"Please fill all the fields"})
    }

    var users= JSON.parse(req.body.users)   //parse all the selected users to add in that group

    if(users.length<1){
        return res.status(400).send({message:"Atleast one user is required to make a group chat"})
    }

    users.push(req.user) //adding the current user ie admin

    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users : users,
            isGroupChat: true,
            groupAdmin : req.user
        })

        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")    // Fetching from backend and sending to user

        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const renameGroup = asyncHandler(async(req, res)=>{
    const { chatId , chatName } = req.body
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName:chatName
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password") 

    if(!updatedChat) {
        res.status(400)
        throw new Error("Chat not found")
    } else {
        res.json(updatedChat)
    }
})

const addToGroup = asyncHandler(async(req, res)=>{
    const { chatId , userId }=req.body
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password") 

    if(!added) {
        res.status(400)
        throw new Error("Chat not found")
    } else {
        res.json(added)
    }
})

const removeFromGroup = asyncHandler(async(req, res)=>{
    const { userId , chatId } =req.body
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull : {users: userId}
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password") 

    if(!removed) {
        res.status(400)
        throw new Error("Chat not found")
    } else {
        res.json(removed)
    }
})
module.exports ={accessChats , fetchChats ,createGroupChat ,renameGroup ,addToGroup,removeFromGroup};