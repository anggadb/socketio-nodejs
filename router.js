import userController from './controllers/user.controller'

let router = require('express').Router()

router.get('/getAllUsers', userController.getAllUsers)
router.post('/postLoginUser', userController.postLoginUser)

module.exports = router;