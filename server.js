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
    socket.on('off-socket', (data) => {
        if (stage === 'development') {
            console.log(socket.id + " is left")
        }
        redisServer.HDEL('online', data.userId)
    })
    socket.on('typing', (data) => {
        if (stage === "development") {
            console.log(data.username + " is typing")
        }
        if (data.recieverSocket != undefined) {
            chatNS.to(data.recieverSocket).emit('typing', data.username + " is typing")
        }
    })
    socket.on('isRead', (username) => {
        socket.emit('isRead', {
            isRead: true,
            sender: username
        })
    })
    socket.on('activated', (data) => {
        let user = {
            name: data.username,
            id: data.userId,
            socketId: socket.id
        }
        redisServer.HEXISTS("online", data.id, (err, res) => {
            if (res == false) {
                if (stage === "development") {
                    console.log("User haven't saved")
                }
                redisServer.HSET("online", data.userId, JSON.stringify(user))
                if (stage === "development") {
                    redisServer.HGET("online", data.userId, (err, res) => {
                        console.log(res)
                    })
                }
            }
        })
    })
    socket.on('get-online-users', (data) => {
        redisServer.HKEYS("online", (err, res) => {
            if (stage === 'development') {
                console.log(res)
            }
            chatNS.to(data.senderSocket).emit('get-online-users', res)
        })
    })
    socket.on('detail-user', (data) => {
        redisServer.HGET('online', data.userId, (err, res) => {
            if (stage === 'development') {
                console.log(res)
            }
            chatNS.to(data.senderSocket).emit('detail-user', res)
        })
    })
    socket.on('new-private-chat', (data) => {
        if (data.recieverSocket != null) {
            if (data.message != null) {
                chatNS.to(data.recieverSocket).emit('new-private-chat', data.message)
            } else {
                chatNS.to(data.recieverSocket).emit('new-private-chat', data.image)
            }
        }
        roomHandler.createPrivateChat(data)
    })
    socket.on('chat', (data) => {
        if (data.recieverSocket != null) {
            if (data.message != null) {
                chatNS.to(data.recieverSocket).emit('chat', data.message)
            } else {
                chatNS.to(data.recieverSocket).emit('chat', data.image)
            }
        }
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
    socket.on('leaving-room', (data) => {
        chatNS.to(data.roomName).emit('Group Announcement', data.username + " is left " + data.roomName)
    })
    socket.on('enter-group', (data) => {
        socket.join(data.groupId)
    })
})
server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err
    console.log("Server berjalan di port " + port + " dengan status " + stage)
})
