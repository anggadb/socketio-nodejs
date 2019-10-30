import model from '../models/index'
import sequelize from 'sequelize'
import fs from 'fs'

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const Sequelize = new sequelize(config.database, config.username, config.password, config);

exports.postChat = async (data, req, res) => {
    try {
        return model.Chats.create(data).then((response) => {
            if (!response) {
                console.log("Gagal menyimpan pesan")
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: error.messages
        })
    }
}
exports.messageRead = async (readerId, groupId, req, res) => {
    try {
        let data = await Sequelize.query("UPDATE Chats SET readers = JSON_ARRAY_APPEND(readers, '$'," + Number(readerId) + ") WHERE reciever=" + groupId + " AND NOT JSON_CONTAINS(readers, " + readerId + ")", { type: sequelize.QueryTypes.SELECT })
        if (data) {
            return "Chat updated"
        } else {
            return "Error while updating selected chat"
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: error.messages
        })
    }
}
exports.decodeBase64Image = (data) => {
    let response = {}
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (matches.length !== 3) {
        return new Error('Invalid input string')
    }
    response.type = matches[1]
    response.data = new Buffer(matches[2], 'base64')
    return response
}
exports.saveImage = (userId, fileName, buffer) => {
    fs.exists(__dirname + '/assets/' + userId, async (exists) => {
        if (!exists) {
            fs.mkdir(__dirname + "/assets/" + userId + '/', (e) => {
                if (!e) {
                    fs.writeFile(__dirname + '/assets/' + userId + "/" + fileName, buffer.data, (err) => {
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
            fs.writeFile(__dirname + '/assets/' + userId + "/" + fileName, buffer.data, (err) => {
                if (err) {
                    console.log(err)
                    throw err
                }
            })
        }
    })
}
