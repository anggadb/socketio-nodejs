import model from '../models/index'
import operator from 'sequelize'

let op = operator.Op

exports.getAllRooms = async (req, res) => {
    try {
        let data = await model.Chatrooms.findAll()
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
