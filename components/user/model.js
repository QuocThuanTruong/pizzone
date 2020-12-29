const {db} = require('../../dal/db')
const bcrypt = require('bcrypt')
const dishModel = require('../dishes/model')

function execQuery(queryString) {
    return new Promise(data => {
/*        console.log(queryString)*/

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
    const user = await execQuery('SELECT * FROM user WHERE username = \''+username+'\' and is_active = 1')

    if (user[0]) {
        let equal = await bcrypt.compareSync(password.toString(), user[0].password.toString());

        if (equal) {
            user[0].cart = await this.getCartByUserId(user[0].user_id)
            return user[0]
        }
    }

   return false
}

exports.getUserById = async (id) => {
    const users =  await execQuery('SELECT * FROM user WHERE user_id = '+ id + ' and is_active = 1')
    let user = users[0];

    user.cart = await this.getCartByUserId(id)

    return user;
}

exports.getCartByUserId = async (id) => {
    let itemInCart = [];
    let totalCostInCart = 0;
    let totalDishInCart = 0;

    let cartTemp = await execQuery('SELECT * FROM cart_items WHERE cart = ' + id + ' and is_active = 1')

    for (let i = 0; i < cartTemp.length; ++i) {
        let dish = await dishModel.getDishById(cartTemp[i].dish);

        console.log(cartTemp[i])

        dish.quantity =  cartTemp[i].quantity;
        dish.cartId = cartTemp[i].cart;
        dish.is_active = cartTemp[i].is_active;
        dish.ordinal_number = cartTemp[i].ordinal_number;
        totalCostInCart += dish.quantity * dish.price;
        totalDishInCart += dish.quantity;

        itemInCart.push(dish)
    }

    let carts = {
        cartId: id,
        itemInCart: itemInCart,
        totalDishInCart: totalDishInCart,
        totalCostInCart: totalCostInCart,
    }

    return carts
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

exports.isExistsUser = async (username) => {
    let result = await execQuery('SELECT EXISTS(SELECT * FROM user WHERE username = \''+username+'\' and is_active = 1) as e')

    return result[0].e;
}

exports.getMaxUserId = async () => {
    const result = await execQuery('SELECT MAX(user_id) as max from user')

    return result[0].max
}

exports.addNewUser = async (username, email, password) => {
    const id = await this.getMaxUserId() + 1

    const _ = await execQuery('INSERT INTO user(user_id, name, avatar, email, phone, username, password, address, role, is_active) values('+ id +', \'\', \'\', \''+ email +'\', \'\', \''+ username +'\', \''+ password +'\', \'\', 0, 1)');
}

exports.getCartById = async (id) => {
    return await execQuery('select * from cart where user = ' + id)
}