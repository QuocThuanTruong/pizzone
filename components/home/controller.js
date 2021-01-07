const dishModel = require('../dishes/model')

exports.index = async (req, res, next) => {
    const pizza = await dishModel.pizzaList()
    const drinks = await dishModel.drinkList()
    const sides = await dishModel.sideList()

    const dataContext = {
        cart: req.user ? req.user.cart : global.cart,
        isLogin: req.user ? true : false,
        user : req.user,
        homePageActive: "active",
        pizza: pizza,
        drinks: drinks,
        sides: sides
    }

    res.render('../components/home/views/index', dataContext);
};
