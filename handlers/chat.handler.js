import model from '../models/index'

exports.postChat = async (sender, reciever, type, message, image, req, res) => {
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
