const express = require('express');

const router = express.Router();
const {registerUser, authUser, allUsers} = require('../controller/userController')
const {protect} = require('../middleware/authMiddleware')

router.route('/').post(registerUser).get(protect,allUsers) //registering 
router.post('/login',authUser) //logging in with already exisiting account
//above both statements are same just syntax are dufferent


module.exports = router;