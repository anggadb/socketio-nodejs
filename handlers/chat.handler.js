import model from '../models/index'
import sequelize from 'sequelize'

const Sequelize = new sequelize(config.database, config.username, config.password, config);

exports.postChat = async (data, req, res) => {
    if (data.image !== undefined) {
        data.imagePath = image
    }
    if (data.chat !== undefined) {
        data.message = message
    }
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
        if(data){
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
