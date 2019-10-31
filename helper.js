import fs from 'fs'

exports.saveImage = (userId, fileName, buffer) => {
    fs.exists(__dirname + '/assets/' + userId, async (exists) => {
        if (!exists) {
            fs.mkdir(__dirname + "/assets/" + userId + '/', (e) => {
                if (!e) {
                    fs.writeFile(__dirname + '/assets/' + userId + "/" + fileName, buffer.data, (err) => {
                        if (err) {
                            console.log(err)
                            throw err
                        }
                    })
                } else {
                    console.log("Error while saving image")
                    throw e
                }
            })
        } else {
            fs.writeFile(__dirname + '/assets/' + userId + "/" + fileName, buffer.data, (err) => {
                if (err) {
                    console.log(err)
                    throw err
                }
            })
        }
    })
}
exports.decodeBase64Image = (data) => {
    let response = {}
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (matches.length !== 3) {
        return new Error('Invalid input string')
    }
    response.type = matches[1]
    response.data = new Buffer(matches[2], 'base64')
    return response
}
