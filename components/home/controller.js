const formidable = require('formidable');

const dishModel = require('../dishes/model')
const userService = require('../user/service')

exports.index = async (req, res, next) => {
    const pizza = await dishModel.pizzaList()
    const drinks = await  dishModel.drinkList()
    const sides = await  dishModel.sideList()

    const dataContext = {
        cart: global.cart,
        isLogin: global.isLogin,
        user : global.user,
        homePageActive: "active",
        pizza: pizza,
        drinks: drinks,
        sides: sides
    }

    res.render('../components/home/views/index', dataContext);
};

exports.register = async (req, res, next) => {
    const form = formidable({multiples: true})

    await form.parse(req, async (err, fields, files) => {
        if (err) {
            return
        }

        let username = fields.username;
        let email = fields.email;
        let password = fields.password;
        let retype = fields.rep_password;



    })
}