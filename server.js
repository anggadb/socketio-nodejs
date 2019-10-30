import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import socketio from 'socket.io'
import socketRedis from 'socket.io-redis'
import redis from 'redis'
import path from 'path'
import fs from 'fs'

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
app.use('/image', express.static(path.join(__dirname + '/assets')))

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
        if (data.groupId !== undefined) {
            socket.leave(data.groupId)
        }
        redisServer.HDEL('online', data.userId)
        socket.emit('off-socket', "User with id : " + data.userId + " is left")
    })
    socket.on('typing', (data) => {
        if (stage === "development") {
            console.log(data.username + " is typing")
        }
        if (data.recieverSocket != undefined) {
            chatNS.to(data.recieverSocket).emit('typing', data.username + " is typing")
        }
    })
    socket.on('isRead', async (data) => {
        let res = await chatHandler.messageRead(data.userId, data.roomId)
        if (res) {
            return socket.emit('isRead', "All messages in chatroom are readed")
        }
    })
    socket.on('activated', (data) => {
        let user = {
            name: data.username,
            id: data.userId,
            socketId: socket.id
        }
        redisServer.HSET("online", data.userId, JSON.stringify(user))
        if (stage === "development") {
            redisServer.HGET("online", data.userId, (err, res) => {
                console.log(res)
            })
        }
        socket.emit('activated', socket.id)
    })
    socket.on('get-online-users', () => {
        redisServer.HKEYS("online", (err, res) => {
            if (stage === 'development') {
                console.log(res)
            }
            socket.emit('get-online-users', res)
        })
    })
    socket.on('detail-user', (data) => {
        redisServer.HGET('online', data.userId, (err, res) => {
            if (stage === 'development') {
                console.log(res)
            }
            socket.emit('detail-user', res)
        })
    })
    socket.on('check-online', (data) => {
        redisServer.HEXISTS("online", data.userId, (err, res) => {
            if (err) throw err
            socket.emit('check-online', res)
        })
    })
    socket.on('chat', (data) => {
        if (data.recieverSocket != null) {
            if (data.message != null) {
                chatNS.to(data.recieverSocket).emit('new-private-chat', data.message)
            } else {
                chatNS.to(data.recieverSocket).emit('new-private-chat', data.image)
            }
        }
        roomHandler.createPrivateChat(data)
    })
    socket.on('leaving-room', (data) => {
        chatNS.to(data.roomName).emit('Group Announcement', data.username + " is left " + data.roomName)
    })
    socket.on('enter-group', (data) => {
        socket.join(data.groupId)
    })
    socket.on('create-group', async (data) => {
        let groupData = {
            participants: data.participants,
            name: data.name,
            creator: data.id,
            type: 'Group'
        }
        try {
            return roomHandler.createGroup(groupData)
        } catch (error) {
            console.log(error.messages)
            throw new Error()
        }
    })
    socket.on('send-image', (data) => {
        const base64Data = chatHandler.decodeBase64Image(data.image)
        let fileName = data.imageName + new Date().toISOString() + ".jpg"
        let imagePath = "/image/" + data.userId + "/" + fileName
        fs.exists(__dirname + '/assets/' + data.userId, async (exists) => {
            if (!exists) {
                fs.mkdir(__dirname + "/assets/" + data.userId + '/', (e) => {
                    if (!e) {
                        fs.writeFile(__dirname + '/assets/' + data.userId + "/" + fileName, base64Data.data, (err) => {
                            if (err) {
                                console.log(err)
                                throw err
                            }
                        })
                    } else {
                        console.log("Error while saving image")
                        throw e
                    }
                })
            } else {
                fs.writeFile(__dirname + '/assets/' + data.userId + "/" + fileName, base64Data.data, (err) => {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                })
            }
            let callback = await chatHandler.postChat({
                sender: data.userId,
                reciever: data.reciever,
                imagePath: imagePath,
                readers: [data.userId]
            })
            if (callback) {
                if (data.recieverSocket != null) {
                    chatNS.to(data.recieverSocket).emit('send-image', imagePath)
                }
            } else {
                socket.emit('send-image', "Gagal")
            }
        })
    })
})
server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err
    console.log("Server berjalan di port " + port + " dengan status " + stage)
})
