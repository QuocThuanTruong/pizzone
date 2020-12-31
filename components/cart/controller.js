const dishModel = require('../dishes/model')
const cartModel = require('./model')
exports.index = async (req, res, next) => {
    const dataContext = {
        isLogin: req.user ? true : false,
        user: req.user,
        cart: req.user ? req.user.cart : global.cart,
    }

    res.render('../components/cart/views/index', dataContext);
}

exports.add = async (req, res, next) => {
    const id = req.params.id;
    const type = parseInt(req.query.type)

    let dish = await dishModel.getDishById(id)

    if (!req.user) {
        let index = global.cart.itemInCart.findIndex(dish => dish.dish_id == id)

        switch (type) {
            case 1: //Add or Increase
                if (index === -1) {
                    dish.quantity = 1
                    global.cart.itemInCart.push(dish);
                } else {
                    global.cart.itemInCart[index].quantity++;
                }

                global.cart.totalCostInCart += dish.price;
                global.cart.totalDishInCart++;
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
        let index = req.user.cart.itemInCart.findIndex(dish => dish.dish_id == id)

        switch (type) {
            case 1: //Add or Increase
                if (index === -1) {
                    dish.quantity = 1
                    req.user.cart.itemInCart.push(dish);

                    await cartModel.insertCardItem([dish], req.user.user_id)
                } else {
                    req.user.cart.itemInCart[index].quantity++;
                    req.user.cart.itemInCart[index].is_active = 1

                    await cartModel.updateCartItem(req.user.cart.itemInCart[index], req.user.user_id)
                }

                req.user.cart.totalCostInCart += dish.price;
                req.user.cart.totalDishInCart++;

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

                    /*req.user.cart.itemInCart[index].quantity = 0;*/
                    req.user.cart.itemInCart[index].is_active = 0;

                    await cartModel.updateCartItem(req.user.cart.itemInCart[index], req.user.user_id)

                    req.user.cart.itemInCart.splice(index, 1)
                }
        }

        res.send(req.user.cart)
    }
}