import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import socketio from 'socket.io'
import socketRedis from 'socket.io-redis'
import redis from 'redis'

import router from './router'
import messageController from './controllers/chat.controller'

let app = express()
let redisServer = redis.createClient(6379)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(process.env.API_PREFIX, router)

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
    socket.on('typing', (from) => {
        if (stage === "development") {
            console.log(from + " is typing")
        }
        socket.broadcast.emit('typing', from + " is typing")
    })
    socket.on('activated', (username, userId) => {
        let user = {
            name: username,
            id: userId,
            socketId: socket.id
        }
        redisServer.SET("user:"+userId, JSON.stringify(user))
        if (stage === "development") {
            redisServer.GET("user:"+userId, (err, data) => {
                console.log(data)
            })
        }
    })
    // socket.on('send image', (from, to, img) => {

    // })
    socket.on('private chat', (from, to, message) => {
        if (stage === "development") {
            console.log(from + " is saying " + message + " to " + to + ' with ID : ' + socket.id)
        }
        socket.on('isRead', (from) => {
            socket.emit({
                isRead: true,
                sender: from
            })
        })
    })
    socket.on('create room', (room, creator) => {
        socket.join(room)
        console.log(io.sockets.adapter.rooms)
        chatNS.to(room).emit('Welcome', "Welcome to " + room + ", " + socket.id)
        socket.on('message', (from, message) => {
            if (stage === 'development') {
                console.log(socket.rooms)
                console.log(from + " is says " + message)
            }
            chatNS.to(room).emit('message', message)
            messageController.postChat(from, room, message, 'Group')
        })
        socket.on('leaving room', (userId) => {
            chatNS.to(room).emit(username + " is left " + room)
        })
    })
})
server.listen(port, (err) => {
    if (err) throw err
    console.log("Server berjalan di port " + port + " dengan status " + stage)
})
