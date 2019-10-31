import model from '../models/index'
import operator from 'sequelize'

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
let op = operator.Op
let Sequelize = new operator(config.database, config.username, config.password, config);

exports.getPrivateRooms = async (req, res) => {
    let activeId = req.query.id
    let offset = Number(req.query.offset) || 0
    let limit = Number(req.query.limit) || 10
    let query = "SELECT Users.name AS roomName, Users.id AS userId, Chatrooms.id, Chatrooms.participants, Chatrooms.creator FROM Users INNER JOIN Chatrooms ON Chatrooms.participants=Users.id OR Chatrooms.creator=Users.id WHERE NOT Users.id=" + activeId + " AND(Chatrooms.participants=" + activeId + " OR Chatrooms.creator=" + activeId + ") LIMIT  " + offset + "," + limit
    try {
        let data = await Sequelize.query(query, { type: operator.QueryTypes.SELECT })
        if (data != 0) {
            return res.status(200).send(data)
        } else {
            return res.status(401).send({
                error: "Data kosong"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: error.messages
        })
    }
}
exports.postCreateGroup = async (req, res) => {
    let reqBody = {
        participants: [req.body.creator],
        name: req.body.name,
        creator: req.body.creator,
        type: "Group"
    }
    try {
        let data = await model.Chatrooms.create(reqBody)
        if (data) {
            return res.status(201).send("Group with name : " + data.name + " is created")
        } else {
            return res.status(500).send("Fail to create group")
        }
    } catch (error) {
        return res.status(500).send({
            error: error.messages
        })
    }
}
