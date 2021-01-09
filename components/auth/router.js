const express = require('express');
const router = express.Router();
const controller = require('./controller')
const passport = require('./passport')
const cartModel = require('../cart/model')

router.post('/register', controller.register)

router.post('/login',
    passport.authenticate('local'),
    function(req, res, next) {
        if (req.session.cart) {
            let cart = req.session.cart;

            if (cart.totalDishInCart > 0) {
                for (let i = 0; i < cart.itemInCart.length; i++) {
                    let dish = cart.itemInCart[i];

                    let index = req.user.cart.itemInCart.findIndex(d => d.dish_id == dish.dish_id && d.size == dish.size);

                    if (index !== -1) {
                        cart.itemInCart[i].ordinal_number = req.user.cart.itemInCart[index].ordinal_number;
                        cart.itemInCart[i].quantity += req.user.cart.itemInCart[index].quantity;
                    }
                }

                cartModel.insertCardItem(cart.itemInCart, req.user.user_id).then(() => {
                    req.session.cart = {
                        temInCart : [],
                        totalCostInCart : 0,
                        totalDishInCart : 0
                    }

                    res.redirect(req.session.oldURL)
                })
            }
        } else {
            res.redirect(req.session.oldURL)
        }
    }
);

router.get('/logout', controller.logout)

module.exports = router;