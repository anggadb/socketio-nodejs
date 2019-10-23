import model from '../models/index'

exports.createGroup = async (data) => {
    try {
        return model.Chatrooms.create(data).then((response) => {
            if (!response) {
                console.log("Gagal membuat room/goup")
            }
        })
    } catch (error) {
        console.log(error.messages)
        throw new Error()
    }
}
exports.createPrivateChat = async (data, req, res) => {
    try {
        return model.Chatrooms.create(data).then((response) => {
            if (response) {
                let chatData = {
                    sender: data.creator,
                    reciever: response.id,
                    readers: [data.creator]
                }
                if (data.image !== undefined) {
                    chatData.imagePath = data.image
                }
                if (data.chat !== undefined) {
                    chatData.message = data.message
                }
                model.Chats.create(chatData).then((res) => {
                    if (!res) {
                        return res.send("Gagal mengirim pesan pada private chat")
                    }
                })
            } else {
                return res.send("Gagal membuat private chat")
            }
        })
    } catch (e) {
        console.log(e.messages)
    }
}