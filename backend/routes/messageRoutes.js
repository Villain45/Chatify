const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {sendMessage,allMessages} = require('../controller/messageControllers')

const router = express.Router();

router.route('/').post(protect,sendMessage); //controller for sending a message
router.route('/:chatId').get(protect,allMessages); //to get all the messages of a particular chat

module.exports = router;