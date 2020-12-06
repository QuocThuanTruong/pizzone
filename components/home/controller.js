const {db} = require('../../dal/db')

const dishesModel = require('../dishes/model')

exports.index = async (req, res, next) => {
    const pizza = await dishesModel.pizzaList()
    const drinks = await  dishesModel.drinkList()
    const sides = await  dishesModel.sideList()

    const dataContext = {
        isLogin: true,
        userFullName: "Nguyen Van A",
        homePageActive: "active",
        pizza: pizza,
        drinks: drinks,
        sides: sides
    }

    res.render('../components/home/views/index', dataContext);
};