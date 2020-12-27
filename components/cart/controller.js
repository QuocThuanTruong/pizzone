const dishModel = require('../dishes/model')

exports.index = async (req, res, next) => {
    const dataContext = {
        isLogin: req.user ? true : false,
        user: req.user,
        cart: global.cart
    }

    res.render('../components/cart/views/index', dataContext);
}

exports.add = async (req, res, next) => {
    const id = req.params.id;
    const type = parseInt(req.query.type)

    let dish = await dishModel.getDishById(id)
    let index = global.cart.dishes.findIndex(dish => dish.dish_id == id)

    switch (type) {
        case 1: //Add or Increase
            if (index === -1) {
                dish.quantity = 1
                global.cart.dishes.push(dish);
            } else {
                global.cart.dishes[index].quantity++;
            }

            global.cart.totalCostInCart += dish.price;
            global.cart.totalDishInCart++;
            break;
        case 2: //Descrease
            if (index === -1) {

                //Do Nothing

            } else {
                if (global.cart.dishes[index].quantity > 1) {
                    global.cart.dishes[index].quantity--;
                    global.cart.totalCostInCart -= dish.price;
                    global.cart.totalDishInCart--;
                }
            }
            break;
        case 3: //Delete
            if (index === -1) {

                //Do Nothing

            } else {
                let deleteDish = global.cart.dishes[index]

                global.cart.totalCostInCart -= (deleteDish.price * deleteDish.quantity);
                global.cart.totalDishInCart -= deleteDish.quantity;

                global.cart.dishes.splice(index, 1)

            }
    }

    res.send(global.cart)
}