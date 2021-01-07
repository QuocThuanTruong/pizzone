const dishModel = require('../dishes/model')
const cartModel = require('./model')

exports.index = async (req, res, next) => {
    const dataContext = {
        isLogin: req.user ? true : false,
        user: req.user,
        cart: req.user ? req.user.cart : global.cart,
    }

    let shippingFee = await cartModel.getShippingFee(dataContext.cart.totalCostInCart)
    dataContext.shippingFee = shippingFee;
    dataContext.totalCost = dataContext.shippingFee + dataContext.cart.totalCostInCart;
    global.totalCost = dataContext.totalCost;

    res.render('../components/cart/views/index', dataContext);
}

exports.add = async (req, res, next) => {
    const id = req.params.id;
    const type = parseInt(req.query.type)
    const size = parseInt(req.query.size)
    const quantity = parseInt(req.query.quantity)

    let dish = await dishModel.getDishById(id)

    let hotDeal = await dishModel.getHotDealByDishId(id)

    if (hotDeal.length > 0) {
        dish.hasHotDeal = true
        dish.hotDeal = hotDeal[0];
        dish.price = Math.floor(dish.price / 100 * (100 - dish.hotDeal.discount) / 1000) * 1000;
    } else {
        dish.hasHotDeal = false;
    }

    let sizeInfo = await dishModel.getSizeByDishIdAndSizeId(dish.dish_id, size)

    dish.price += sizeInfo.extra_price;
    dish.sizeName = sizeInfo.name;

    if (!req.user) {
        let index = global.cart.itemInCart.findIndex(d => d.dish_id == id && d.size == size)

        console.log(index)

        switch (type) {
            case 1: //Add or Increase
                if (index === -1) {
                    dish.quantity = quantity
                    dish.size = size
                    global.cart.itemInCart.push(dish);
                } else {
                    global.cart.itemInCart[index].quantity += quantity;
                    dish.quantity = global.cart.itemInCart[index].quantity
                }

                global.cart.totalCostInCart += (dish.price * dish.quantity);
                global.cart.totalDishInCart += quantity;
                break;
            case 2: //Descrease
                if (index === -1) {

                    //Do Nothing

                } else {
                    if (global.cart.itemInCart[index].quantity > 1) {
                        global.cart.itemInCart[index].quantity--;
                        global.cart.totalCostInCart -= dish.price;
                        global.cart.totalDishInCart--;
                    }
                }
                break;
            case 3: //Delete
                if (index === -1) {

                    //Do Nothing

                } else {
                    let deleteDish = global.cart.itemInCart[index]

                    global.cart.totalCostInCart -= (deleteDish.price * deleteDish.quantity);
                    global.cart.totalDishInCart -= deleteDish.quantity;

                    global.cart.itemInCart.splice(index, 1)
                }
        }

        res.send(global.cart)
    } else {
        let index = req.user.cart.itemInCart.findIndex(d => d.dish_id == id && d.size == size)

        switch (type) {
            case 1: //Add or Increase
                if (index === -1) {
                    dish.quantity = 1
                    dish.size = size
                    req.user.cart.itemInCart.push(dish);

                    await cartModel.insertCardItem([dish], req.user.user_id)
                } else {
                    req.user.cart.itemInCart[index].quantity += quantity;
                    req.user.cart.itemInCart[index].is_active = 1

                    dish.quantity = req.user.cart.itemInCart[index].quantity

                    await cartModel.updateCartItem(req.user.cart.itemInCart[index], req.user.user_id)
                }

                req.user.cart.totalCostInCart += (dish.price * dish.quantity);
                req.user.cart.totalDishInCart += quantity;

                break;
            case 2: //Descrease
                if (index === -1) {

                    //Do Nothing

                } else {
                    if (req.user.cart.itemInCart[index].quantity > 1) {
                        req.user.cart.itemInCart[index].quantity--;
                        req.user.cart.totalCostInCart -= dish.price;
                        req.user.cart.totalDishInCart--;

                        await cartModel.updateCartItem(req.user.cart.itemInCart[index], req.user.user_id)
                    }
                }
                break;
            case 3: //Delete
                if (index === -1) {

                    //Do Nothing

                } else {
                    let deleteDish =  req.user.cart.itemInCart[index]

                    req.user.cart.totalCostInCart -= (deleteDish.price * deleteDish.quantity);
                    req.user.cart.totalDishInCart -= deleteDish.quantity;

                    req.user.cart.itemInCart[index].quantity = 0;
                    req.user.cart.itemInCart[index].is_active = 0;

                    await cartModel.updateCartItem(req.user.cart.itemInCart[index], req.user.user_id)

                    req.user.cart.itemInCart.splice(index, 1)
                }
        }

        res.send(req.user.cart)
    }
}