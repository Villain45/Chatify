const express = require("express");
const { protect } = require("../middleware/authMiddleware") // if user logged in then only he can access this route
const router=express.Router(); 
const {accessChats,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require("../controller/chatControllers")

//API for the Chat to access fetch creategroup renameGroup addTo removeFrom
router.route('/').post(protect,accessChats) //For accessing chats 
router.route('/').get(protect,fetchChats) //For fetching chats 
router.route('/group').post(protect,createGroupChat) // create group chat
router.route('/rename').put(protect,renameGroup)
router.route('/groupadd').put(protect,addToGroup)
router.route('/groupremove').put(protect,removeFromGroup)


module.exports = router