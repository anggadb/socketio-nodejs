import model from '../models/index'
import operator from 'sequelize'

let op = operator.Op

exports.getMessageByRoom = async (req, res) => {
    let userId = req.query.id
    let offset = req.query.offset || undefined
    let limit = req.query.limit || undefined
    let query = {
        where: {
            reciever: userId
        }
    }
    if(offset !== undefined){
        query.offset = Number(offset)
    }
    if(limit !== undefined){
        query.limit = Number(limit)
    }
    console.log(query)
    try {
        let data = await model.Chats.findAll(query)
        if (data) {
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
