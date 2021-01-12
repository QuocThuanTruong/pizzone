const orderModel = require('./model')
const cartModel = require('../cart/model')

exports.order = async (req, res, next) => {
    const cart = req.user.cart;

    for (let i = 0; i < cart.itemInCart.length; i++) {
        /*cart.itemInCart[i].quantity = 0;*/
        cart.itemInCart[i].is_active = 0;

        await cartModel.updateCartItem(cart.itemInCart[i], req.user.user_id)
    }

    await orderModel.insertOrder(cart, req.session.totalCost, req.session.shippingFee, req.user.user_id)

    req.user.cart.itemInCart = [];
    req.user.cart.totalDishInCart = 0;
    req.user.cart.totalCostInCart = 0;

    res.redirect('/user/my-orders');
}

exports.cancel = async (req, res, next) => {
    let order_id = req.query.order_id;
    let fromDetail = req.query.detail;

    await orderModel.cancelOrder(order_id);

    let orderCancelIndex = {};
    for (let i = 0; i < req.session.currentOrders.length; i++) {
        if (req.session.currentOrders[i].order_id === parseInt(order_id)) {
            orderCancelIndex = i;
            break;
        }
    }

    req.session.currentOrders.splice(orderCancelIndex, 1)

    if (fromDetail === '1') {
        res.redirect('user/dummyOrder')
    } else {
        res.send(req.session.currentOrders)
    }
}