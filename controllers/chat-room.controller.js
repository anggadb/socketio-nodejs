import model from '../models/index'
import operator from 'sequelize'

let op = operator.Op
let Sequelize = new operator('chattdb', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
})

exports.getPrivateRooms = async (req, res) => {
    let activeId = req.query.id
    try {
        let data = await Sequelize.query("SELECT Users.name AS roomName, Chatrooms.id, Chatrooms.participants, Chatrooms.creator FROM Users INNER JOIN Chatrooms ON Chatrooms.participants=Users.id WHERE NOT Users.id=" + activeId, { type: operator.QueryTypes.SELECT })
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
