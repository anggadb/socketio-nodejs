import model from '../models/index'

exports.createGroup = async (data) => {
    try{
        return model.Chatroom.create(data).then((response) => {
            if(!response){
                console.log("Gagal membuat room/goup")
            }
        })
    }catch(error){
        console.log(error.messages)
        throw new Error()
    }
}