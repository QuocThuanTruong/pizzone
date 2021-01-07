const orderModel = require('./model')
const cartModel = require('../cart/model')

exports.order = async (req, res, next) => {
    const cart = req.user.cart;

    console.log(cart)

    for (let i = 0; i < cart.itemInCart.length; i++) {
        /*cart.itemInCart[i].quantity = 0;*/
        cart.itemInCart[i].is_active = 0;

        await cartModel.updateCartItem(cart.itemInCart[i], req.user.user_id)
    }

    await orderModel.insertOrder(cart, global.totalCost, req.user.user_id)

    req.user.cart.itemInCart = [];
    req.user.cart.totalDishInCart = 0;
    req.user.cart.totalCostInCart = 0;

    res.redirect('/user/my-orders');
}

exports.cancel = async (req, res, next) => {
    let dish = {}
    dish.order_id = req.query.order_id;
    dish.ordinal_number = req.query.ordinal_number;
    dish.dish_id = req.query.dish

    await orderModel.cancelOrderDetail(dish);

    let currentOrders = await orderModel.getCurrentOrderByUserId(req.user.user_id);
    res.send(currentOrders)
}