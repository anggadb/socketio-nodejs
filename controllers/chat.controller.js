import model from '../models/index'
import operator from 'sequelize'

let op = operator.Op

exports.getMessageById = async (req, res) => {
    let userId = req.query.id
    try {
        let data = await model.Chats.findAll({
            where: {
                [op.or]: [
                    { sender: userId },
                    { reciever: userId }
                ]
            }
        })
        if (data > 0) {
            return res.status(200).send(data)
        } else {
            return res.status(400).send({
                error: "ID tidak ada dalam chatroom"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: error.messages
        })
    }
}
