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

let app = express()
let redisServer = redis.createClient(6379)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(process.env.API_PREFIX, router)
app.get('/', (req, res) => {
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
let chatNS = io.of('/chat')
// let chatNS = io

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
    socket.on('off', (data) => {
        redisServer.DEL("user:" + data.userId)
        if (stage === "development") {
            console.log(data.username + " is off")
        }
    })
    socket.on('activated', (data) => {
        let user = {
            name: data.username,
            id: data.id,
            socketId: data.socketId
        }
        redisServer.HEXISTS("online", "user" + data.userId, (err, data) => {
            if (data == false) {
                if (stage === "development") {
                    console.log("User haven't saved")
                }
                redisServer.HSET("online", "user" + user.id, JSON.stringify(user))
                if (stage === "development") {
                    redisServer.HGET("online", "user" + user.id, (err, res) => {
                        console.log(res)
                    })
                }
            }
        })
    })
    // socket.on('send image', (from, to, img) => {

    // })
    socket.on('get-online-users', () => {
        redisServer.HKEYS("online", (err, data) => {
            console.log(data)
            socket.emit('get-online-users', data)
        })
    })
    socket.on('private-chat', (data) => {
        chatNS.to(data.recieverSocket).emit('private chat', data.message)
        chatHandler.postChat({
            sender: data.sender,
            reciever: data.reciever,
            message: data.message || null,
            imagePath: data.imageName || null,
            readers: [data.sender]
        })
        if (stage === "development") {
            console.log(socket.id + " is saying " + data.message + " to " + data.recieverSocket)
        }
    })
    socket.on('create-room', (data) => {
        socket.join(data.roomName)
        roomHandler.createGroup({
            participants: data.participants,
            name: data.roomName,
            creator: data.creator,
            type: data.type
        })
        chatNS.to(data.roomName).emit('Welcome', "Welcome to " + data.roomName + ", " + socket.id)
    })
    socket.on('leaving-room', (data) => {
        chatNS.to(data.roomName).emit('Group Announcement', data.username + " is left " + data.roomName)
    })
    socket.on('group-message', (data) => {
        if (stage === 'development') {
            console.log(socket.rooms)
            console.log(from + " is says " + message)
        }
        chatNS.to(data.socketRoom).emit('group-message', data.message)
        chatHandler.postChat({
            sender: data.sender,
            reciever: data.reciever,
            chat: data.message || null,
            image: data.imageName || null,
            readers: [data.sender]
        })
    })
})
server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err
    console.log("Server berjalan di port " + port + " dengan status " + stage)
})
