import model from '../models/index'
import operator from 'sequelize'

let op = operator.Op

exports.getAllUsers = async (req, res) => {
    try {
        let users = await model.Users.findAll({})
        return res.status(200).send({
            data: users,
            total: users.length
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.messages
        })
    }
}
exports.postLoginUser = async (req, res) => {
    let nik = req.body.nik
    let pwd = req.body.pwd
    let isExist = await model.User.findAll({
        where: {
            nik: nik
        }
    })
    if (isExist !== 0) {
        try {
            let data = await model.User.findAll({
                where: {
                    nik: nik,
                    password: pwd
                }
            })
            return res.status(200).send({
                data: data
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                error: error.messages
            })
        }
    } else {
        return res.status(404).send({
            error: 'NIK : ' + nik + ' tidak ditemukan'
        })
    }
}
