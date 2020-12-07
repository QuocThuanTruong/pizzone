const {db} = require('../../dal/db')

function execQuery(queryString) {
    return new Promise(data => {
        console.log(queryString)

        db.query(queryString, (err, results, fields) => {
            if (err) {
                console.log(err)
            } else {
                try {
                    data(results);
                } catch (error) {
                    data({});
                    throw error;
                }
            }
        })
    })
}

exports.getUserByUsernameAndPassword = async (username, password) => {
    const user = await execQuery('SELECT * FROM user WHERE username = \''+username+'\' AND password = \''+password+'\'')

    return user[0]
}

exports.getUserById = async (id) => {
    const user =  await execQuery('SELECT * FROM user WHERE user_id = '+id)

    return user[0]
}

exports.modify = (fields, id) => {
    let user_id = id
    let name = fields.name
    let email = fields.email
    let phone = fields.phone
    let address = fields.address

    return {
        user_id: user_id,
        name: name,
        avatar: "",
        email: email,
        phone: phone,
        address: address,
    }
}

exports.update = async (newUser) => {
    const _ = await execQuery('UPDATE user SET name = \''+newUser.name+'\', avatar = \''+newUser.avatar+'\', email = \''+newUser.email+'\', phone = \''+newUser.phone+'\', address = \''+newUser.address+'\' WHERE user_id = '+newUser.user_id)
}