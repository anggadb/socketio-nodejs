import model from '../models/index'

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
exports.messageRead = async (chatId, req, res) => {
    try {
        sequelize.query("UPDATE Chats SET readers = JSON_ARRAY_APPEND (readers, '$'," + chatId + ")", null, { raw: true }).success((data) => {
            console.log(data)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: error.messages
        })
    }
}
