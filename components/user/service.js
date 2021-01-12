const userModel = require('./model')
const bcrypt = require('bcrypt')

exports.addNewUser = async (username, email, password, is_active) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)

    const _ = await userModel.addNewUser(username, email, hash, is_active);
}

exports.changePassword = async (user_id, newPassword) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(newPassword, salt)

    const _ = await userModel.changePassword(user_id, hash);
}


exports.getUserByUsernameAndPassword = async (username, password) => {
    let user = await userModel.getUserByUsernameAndPassword(username, password)

    return user;
}

exports.getUserById = async (id) => {
    return await userModel.getUserById(id)
}
