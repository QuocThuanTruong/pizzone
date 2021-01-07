const userModel = require('./model')

exports.isExistsAPI = async (req, res, next) => {
    let isExists = await userModel.isExistsUser(req.params.username)

    res.send({isExists: isExists})
}

exports.checkUserAPI = async (req, res, next) => {
    const username = req.query.username
    const password = req.query.password

    let user = await userModel.getUserByUsernameAndPassword(username, password)

    if (user) {
        res.json(true)
    } else {
        res.json(false)
    }
}