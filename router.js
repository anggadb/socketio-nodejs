import userController from './controllers/user.controller'
import roomController from './controllers/chat-room.controller'
import chatController from './controllers/chat.controller'

let router = require('express').Router()

// Room routes
router.get('/getAllRooms', roomController.getAllRooms)

// User routes
router.get('/getAllUsers', userController.getAllUsers)
router.post('/postLoginUser', userController.postLoginUser)

// Chat routes
router.get('/getMessageByRoom', chatController.getMessageByRoom)

module.exports = router;