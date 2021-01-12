const dishModel = require('../dishes/model')
const userModel = require('../user/model')
const userService = require('../user/service')

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

exports.login = async (req, res, next) => {
    res.render('../components/home/views/index', {activeLogin: 'active'});
}

exports.register = async (req, res, next) => {
    res.render('../components/home/views/index', {activeRegister: 'active'});
}

exports.verifyEmail = (req, res, next) => {
    let isNew = false
    let email = ''

    if (req.query.is_new == 1) {
        isNew = true;
    }

    if (req.query.email) {
        email = req.query.email
    }

    let cart = {};
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

    res.render('../components/home/views/verify', {cart: cart, email:email, isNew: isNew});
}

exports.resend = (req, res, next) => {

    let notification = ''
    let isNew = false

    if (req.query.status == 0) {
       notification = 'Xác thực không thành công'
    }

    if (req.query.is_new == 1) {
        isNew = true;
    }

    let cart = {};
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

    res.render('../components/home/views/resend', {cart: cart, notification: notification, email: req.query.email, isNew: isNew});
}


exports.recoverPassword = async (req, res, next) => {
    let email = req.query.email

    let cart = {};
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

    res.render('../components/home/views/recoverPassword', {cart: cart, email: email});
}

exports.updatePassword = async (req, res, next) => {
    let newPass = req.body.newPassword
    let retypePass = req.body.retypePassword
    let email = req.query.email

    console.log(email)
    console.log(newPass)
    console.log(retypePass)

    let user_id = await userModel.getUserIDByEmail(email)

    console.log(user_id)

    if (newPass === retypePass) {

        await userService.changePassword(user_id, newPass);

    }

    res.redirect('')
}





