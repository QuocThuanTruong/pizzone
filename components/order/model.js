const {db} = require('../../dal/db')
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

exports.getMaxOrderId = async () => {
    const result = await execQuery('SELECT MAX(order_id) as max from orders')

    return result[0].max
}

exports.getCurrentOrderByUserId = async (user_id) => {
    const orders = await execQuery('SELECT * FROM orders WHERE user = ' + user_id + ' and status = 0')
    let currentOrders = []

    for (let i = 0; i < orders.length; i ++) {
        const order_id = orders[i].order_id;

        let currentOrder = await execQuery('SELECT * FROM order_detail where order_id = '+ order_id + ' and is_active = 1')

        for (let i = 0; i < currentOrder.length; i++) {
            let order = currentOrder[i];

            let dish = await dishModel.getDishById(order.dish)
            dish.order_id = order.order_id
            dish.quantity = order.quantity
            dish.ordinal_number = order.ordinal_number;

            currentOrders.push(dish);
        }
    }

    return currentOrders;
}

exports.getOrderedByUserId = async (user_id) => {
    const orders = await execQuery('SELECT * FROM orders WHERE user = ' + user_id + ' and status = 1')
    let ordereds = []

    for (let i = 0; i < orders.length; i++) {
        const order_id = orders[i].order_id;

        let ordered = await execQuery('SELECT * FROM order_detail where order_id = '+ order_id + ' and is_active = 1')

        for (let i = 0; i < ordered.length; i++) {
            let order = ordered[i];

            let dish = await dishModel.getDishById(order.dish)
            dish.order_id = order.order_id
            dish.quantity = order.quantity
            dish.ordinal_number = order.ordinal_number;

            ordereds.push(dish);
        }
    }

    return ordereds;
}

exports.insertOrder = async (cart, user_id) => {
    const order_id = (await this.getMaxOrderId()) + 1;

    await execQuery('INSERT INTO orders(order_id, user, total_price, status, is_active) values('+order_id+', '+user_id+', '+cart.totalCostInCart+', 0, 1)')

    for (let i = 0; i < cart.itemInCart.length; i++) {
        let dish = cart.itemInCart[i];
        dish.order_id = order_id;
        dish.ordinal_number = i + 1;

        await this.insertOrderDetail(dish)
    }
}

exports.insertOrderDetail = async (dish) => {
    await execQuery('INSERT INTO order_detail(order_id, ordinal_number, dish, price, quantity, is_active) values('+dish.order_id+', '+dish.ordinal_number+', '+dish.dish_id+', '+dish.price+', '+dish.quantity+', 1)')
}

exports.cancelOrderDetail = async (dish) => {
    await execQuery('UPDATE order_detail SET is_active = 0 WHERE order_id = ' + dish.order_id + ' and ordinal_number = ' + dish.ordinal_number + ' and dish = ' + dish.dish_id)
}