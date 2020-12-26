const userModel = require('./model')

exports.isExists = async (req, res, next) => {
    let isExists = await userModel.isExistsUser(req.params.username)

    res.send({isExists: isExists})
}
