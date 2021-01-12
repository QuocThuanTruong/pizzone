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
    const orders = await execQuery('SELECT * FROM orders WHERE user = ' + user_id + ' and (status = 0 or status = 1)')

    for (let i = 0; i < orders.length; i++) {
        const order_id = orders[i].order_id;
        switch (orders[i].status) {
            case 0 :
                orders[i].statusColor = 'blue';
                orders[i].statusName = 'Đang chuẩn bị';
                break;
            case 1 :
                orders[i].statusColor = 'yellow';
                orders[i].statusName = 'Đang giaọ';
                break;
        }

        let currentOrdersDetail = await execQuery('SELECT * FROM order_detail where order_id = '+ order_id)

        for (let j = 0; j < currentOrdersDetail.length; j++) {
            let orderDetail = currentOrdersDetail[j];

            let dish = await dishModel.getDishById(orderDetail.dish)
            dish.order_id = orderDetail.order_id
            dish.quantity = orderDetail.quantity
            dish.ordinal_number = orderDetail.ordinal_number;
            dish.orderPrice  = orderDetail.price;
            dish.name_uppercase = dish.name.toUpperCase();

            let sizeInfo = await dishModel.getSizeByDishIdAndSizeId(orderDetail.dish, orderDetail.size)
            orderDetail.sizeName = sizeInfo.name;

            currentOrdersDetail[j].dishDetail = dish
        }

        orders[i].currentOrdersDetail = currentOrdersDetail
    }

    return orders;
}

exports.getSuccessOrderByUserId = async (user_id) => {
    const orders = await execQuery('SELECT * FROM orders WHERE user = ' + user_id + ' and status = 2')

    for (let i = 0; i < orders.length; i++) {
        const order_id = orders[i].order_id;

        let successOrdersDetail = await execQuery('SELECT * FROM order_detail where order_id = '+ order_id)

        for (let j = 0; j < successOrdersDetail.length; j++) {
            let orderDetail = successOrdersDetail[j];

            let dish = await dishModel.getDishById(orderDetail.dish)
            dish.order_id = orderDetail.order_id
            dish.quantity = orderDetail.quantity
            dish.ordinal_number = orderDetail.ordinal_number;
            dish.orderPrice  = orderDetail.price;
            dish.name_uppercase = dish.name.toUpperCase();

            let sizeInfo = await dishModel.getSizeByDishIdAndSizeId(orderDetail.dish, orderDetail.size)
            orderDetail.sizeName = sizeInfo.name;

            successOrdersDetail[j].dishDetail = dish
        }

        orders[i].successOrdersDetail = successOrdersDetail
    }

    return orders;
}

exports.getCancelOrderByUserId = async (user_id) => {
    const orders = await execQuery('SELECT * FROM orders WHERE user = ' + user_id + ' and status = 3')

    for (let i = 0; i < orders.length; i++) {
        const order_id = orders[i].order_id;

        let cancelOrdersDetail = await execQuery('SELECT * FROM order_detail where order_id = '+ order_id)

        for (let j = 0; j < cancelOrdersDetail.length; j++) {
            let orderDetail = cancelOrdersDetail[j];

            let dish = await dishModel.getDishById(orderDetail.dish)
            dish.order_id = orderDetail.order_id
            dish.quantity = orderDetail.quantity
            dish.ordinal_number = orderDetail.ordinal_number;
            dish.orderPrice  = orderDetail.price;
            dish.name_uppercase = dish.name.toUpperCase();

            let sizeInfo = await dishModel.getSizeByDishIdAndSizeId(orderDetail.dish, orderDetail.size)
            orderDetail.sizeName = sizeInfo.name;

            cancelOrdersDetail[j].dishDetail = dish
        }

        orders[i].cancelOrdersDetail = cancelOrdersDetail
    }

    return orders;
}

exports.getOrderById = async (order_id) => {
    const orders = await execQuery('SELECT * FROM orders WHERE order_id = ' + order_id)

    order_id = orders[0].order_id;
    orders[0].totalCostInOrder = 0;

    let ordersDetail = await execQuery('SELECT * FROM order_detail where order_id = '+ order_id)

    for (let i = 0; i < ordersDetail.length; i++) {
        let orderDetail = ordersDetail[i];

        let dish = await dishModel.getDishById(orderDetail.dish)
        dish.order_id = orderDetail.order_id
        dish.quantity = orderDetail.quantity
        dish.ordinal_number = orderDetail.ordinal_number;
        dish.orderPrice  = orderDetail.price;
        dish.name_uppercase = dish.name.toUpperCase();

        let sizeInfo = await dishModel.getSizeByDishIdAndSizeId(orderDetail.dish, orderDetail.size)
        orderDetail.sizeName = sizeInfo.name;

        ordersDetail[i].dishDetail = dish

        orders[0].totalCostInOrder += dish.quantity * dish.orderPrice;
    }

    orders[0].ordersDetail = ordersDetail

    if (orders[0].status === 1 || orders[0].status === 0) {
        orders[0].isCurrentOrder = true;
    }

    return orders[0];
}

exports.insertOrder = async (cart, totalCost, shippingFee, user_id) => {
    const order_id = (await this.getMaxOrderId()) + 1;

    await execQuery('INSERT INTO orders(order_id, user, total_price, shipping_fee, status, is_active) values('+order_id+', '+user_id+', '+totalCost+', ' + shippingFee + ', 0, 1)')

    for (let i = 0; i < cart.itemInCart.length; i++) {
        let dish = cart.itemInCart[i];
        dish.order_id = order_id;
        dish.ordinal_number = i + 1;

        await this.insertOrderDetail(dish)
    }
}

exports.insertOrderDetail = async (dish) => {
    await execQuery('INSERT INTO order_detail(order_id, ordinal_number, dish, size, price, quantity, is_active) values('+dish.order_id+', '+dish.ordinal_number+', '+dish.dish_id+', ' +dish.size+', '+dish.price+', '+dish.quantity+', 1)')
}

exports.cancelOrderDetail = async (dish) => {
    await execQuery('UPDATE order_detail SET is_active = 0 WHERE order_id = ' + dish.order_id + ' and ordinal_number = ' + dish.ordinal_number + ' and dish = ' + dish.dish_id)
}

exports.cancelOrder = async (order_id) => {
    await execQuery('UPDATE orders SET status = 3 WHERE order_id = ' + order_id)
}