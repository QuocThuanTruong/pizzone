const dishModel = require('../dishes/model')

exports.index = async (req, res, next) => {
    const dishesHasHotDeal = await dishModel.getDishesHasHotDeal()
    const pizza = await dishModel.listByCategory(1, 0, 1000000,1, 3, '1')
    const drinks = await dishModel.listByCategory(2, 0, 1000000,1, 3, '1')
    const sides = await dishModel.listByCategory(3, 0, 1000000,1, 3, '1')
    let cart = {}

    if (req.user) {
        cart = req.user.cart
    } else {
        if (req.session.cart) {
            cart = req.session.cart
        } else {
            cart = {
                itemInCart : [],
                totalCostInCart : 0,
                totalDishInCart : 0
            }
        }
    }

    const dataContext = {
        cart: cart,
        isLogin: req.user ? true : false,
        user : req.user,
        homePageActive: "active",
        dishesHasHotDeal: dishesHasHotDeal,
        pizza: pizza,
        drinks: drinks,
        sides: sides
    }

    req.session.oldURL = req.originalUrl;
    res.render('../components/home/views/index', dataContext);
};

exports.verifyEmail = (req, res, next) => {




    res.render('../components/home/views/verify');
}

exports.recoverPassword = (req, res, next) => {
    res.render('../components/home/views/recoverPassword');
}
