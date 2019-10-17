import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import socketio from 'socket.io'
import socketRedis from 'socket.io-redis'
import redis from 'redis'
import path from 'path'

import router from './router'
import chatHandler from './handlers/chat.handler'
import roomHandler from './handlers/room.handler'

let testingRoute = '/'
let app = express()
let redisServer = redis.createClient(6379)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(process.env.API_PREFIX, router)
app.get(testingRoute, (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

let stage = process.argv[3] || "development"
let port = parseInt(process.argv[2]) || process.env.PORT
let server = http.createServer(app)
let io = socketio(server).adapter(socketRedis({
    host: 'localhost',
    port: 6379
}))
// use this for namespace in multi-node/microservice
// let chatNS = io.of('/chat')
let chatNS = io

chatNS.on('connection', (socket) => {
    if (stage === "development") {
        console.log('A client connected with id : ' + socket.id)
    }
    socket.on('disconnect', () => {
        if (stage === 'development') {
            console.log(socket.id + " is left")
        }
    })
    socket.on('typing', (username) => {
        if (stage === "development") {
            console.log(username + " is typing")
        }
        socket.broadcast.emit('typing', username + " is typing")
    })
    socket.on('isRead', (username) => {
        socket.emit('isRead', {
            isRead: true,
            sender: username
        })
    })
    socket.on('off', (userId, username) => {
        redisServer.DEL("user:" + userId)
        if (stage === "development") {
            console.log(username + " is off")
        }
    })
    socket.on('activated', (username, userId) => {
        let user = {
            name: username,
            id: userId,
            socketId: socket.id
        }
        redisServer.SET("user:" + userId, JSON.stringify(user))
        if (stage === "development") {
            redisServer.GET("user:" + userId, (err, data) => {
                console.log(data)
            })
        }
    })
    // socket.on('send image', (from, to, img) => {

    // })
    socket.on('private chat', (senderId, recieverId, message, recieverSocket) => {
        chatNS.to(recieverSocket).emit('private chat', message)
        chatHandler.postChat(senderId, recieverId, "Private", message)
        if (stage === "development") {
            console.log(socket.id + " is saying " + message + " to " + socketId + ' with ID : ')
        }
    })
    socket.on('create room', (room, creator, userId) => {
        socket.join(room)
        // roomHandler.createGroup(room, creator, creator)
        chatNS.to(room).emit('Welcome', "Welcome to " + room + ", " + socket.id)
        socket.on('message', (from, message) => {
            if (stage === 'development') {
                console.log(socket.rooms)
                console.log(from + " is says " + message)
            }
            chatNS.to(room).emit('message', message)
            chatHandler.postChat(from, room, message, 'Group')
        })
        socket.on('leaving room', (username) => {
            chatNS.to(room).emit('Group Announcement', username + " is left " + room)
        })
    })
})
server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err
    console.log("Server berjalan di port " + port + " dengan status " + stage)
})
