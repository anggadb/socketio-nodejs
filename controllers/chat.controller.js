import model from '../models/index'
import operator from 'sequelize'

let op = operator.Op

exports.getMessageByUser = async (req, res) => {
    let userId = req.query.id
    try {
        let data = await model.Chat.findAll({
            where: {
                id: userId
            }
        })
        if (data > 0) {
            return res.status(200).send({
                data: data,
                total: data.length
            })
        } else {
            return res.status(400).send({
                error: "ID tidak terdaftar"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: error.messages
        })
    }
}
exports.postChat = async (sender, reciever, message, type, image, req, res) => {
    let data = {
        sender: sender,
        reciever: reciever,
        type: type,
        reciever: reciever
    }
    if(image !== undefined){
        data.imagePath = image
    }
    if(message !== undefined){
        data.message = message
    }
    try {
        return model.Chat.create(data).then((response) => {
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