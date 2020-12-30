const {db} = require('../../dal/db')
const dishModel = require('../dishes/model')

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

exports.getMaxCartId = async () => {
    const result = await execQuery('SELECT MAX(cart_id) as max from cart')

    return result[0].max
}

exports.getMaxOrdinalNumberInCartItemsById = async (id) => {
    const result = await execQuery('SELECT MAX(ordinal_number) as max from cart_items where cart = ' + id)

    return result[0].max
}

exports.getOrdinalNumberInCartItems = async (cart, user_id) => {
    const result = await execQuery('SELECT * from cart_items where cart = ' + user_id +' and dish = ' + cart.dish_id);

    return result[0].ordinal_number
}

exports.insertCard = async (user_id) => {
    let cart_id = await this.getMaxCartId() + 1;

    const _ = await execQuery('INSERT INTO cart(cart_id, user, status) VALUES ( ' + cart_id + ', ' + user_id + ', 0)')

    return cart_id;
}

exports.insertCardItem = async (carts, user_id) => {
    for (let i = 0; i < carts.length; i++) {
        let cart = carts[i];

        let exists = await this.checkExistsCartItem(cart, user_id)

        if (!exists) {
            cart.ordinal_number = (await this.getMaxOrdinalNumberInCartItemsById(user_id)) + 1;
            console.log(cart.ordinal_number)

            await execQuery('INSERT INTO cart_items(cart, ordinal_number, dish, quantity, price, is_active) VALUES (' + user_id+ ', ' + cart.ordinal_number +', ' + cart.dish_id + ' , ' + cart.quantity + ', '+(cart.quantity * cart.price)+', 1)')
        } else {
            cart.ordinal_number = await this.getOrdinalNumberInCartItems(cart, user_id);

            await execQuery('UPDATE cart_items SET quantity='+ cart.quantity +', is_active = 1 WHERE cart = '+user_id+' and ordinal_number = '+cart.ordinal_number+' and dish = '+cart.dish_id)
        }
    }
}

exports.getCartByUserId = async (id) => {
    let itemInCart = [];
    let totalCostInCart = 0;
    let totalDishInCart = 0;

    let cartTemp = await execQuery('SELECT * FROM cart_items WHERE cart = ' + id + ' and is_active = 1')

    for (let i = 0; i < cartTemp.length; ++i) {
        console.log(cartTemp[i])
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

exports.updateCartItem = async (cart, user_id) => {
    await execQuery('UPDATE cart_items SET quantity='+ cart.quantity +', is_active = '+ cart.is_active + ' WHERE cart = '+user_id+' and ordinal_number = '+cart.ordinal_number+' and dish = '+cart.dish_id)
}

exports.checkExistsCartItem = async (cart, user_id) => {
    let result = await execQuery('SELECT EXISTS(SELECT * FROM cart_items WHERE cart = '+user_id+' and dish = '+cart.dish_id+ ') as e')

    return result[0].e;
}