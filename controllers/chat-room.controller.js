import model from '../models/index'
import operator from 'sequelize'

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
let op = operator.Op
let Sequelize = new operator(config.database, config.username, config.password, config);

exports.getPrivateRooms = async (req, res) => {
    let activeId = req.query.id
    try {
        let data = await Sequelize.query("SELECT Users.name AS roomName, Users.id AS userId, Chatrooms.id, Chatrooms.participants, Chatrooms.creator FROM Users INNER JOIN Chatrooms ON Chatrooms.participants=Users.id OR Chatrooms.creator=Users.id WHERE NOT Users.id="+ activeId +" AND(Chatrooms.participants="+ activeId +" OR Chatrooms.creator="+ activeId +")", { type: operator.QueryTypes.SELECT })
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
