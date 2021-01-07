const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

const userService = require('../user/service')
const cartModel = require('../cart/model')

passport.use(new LocalStrategy(
    function(username, password, done) {
        userService.getUserByUsernameAndPassword(username, password).then( (user) => {
            if (!user) {
                return done(null, false)
            } else {
                if (global.cart.totalDishInCart > 0) {
                    for (let i = 0; i < global.cart.itemInCart.length; i++) {
                        let dish = global.cart.itemInCart[i];

                        let index = user.cart.itemInCart.findIndex(d => d.dish_id == dish.dish_id);

                        if (index !== -1) {
                            global.cart.itemInCart[i].ordinal_number = user.cart.itemInCart[index].ordinal_number;
                            global.cart.itemInCart[i].quantity += user.cart.itemInCart[index].quantity;
                        }
                    }

                    cartModel.insertCardItem(global.cart.itemInCart, user.user_id).then( () => {
                        return done(null, user)
                    })

                } else {
                    return done(null, user)
                }
            }
        }).catch((err) => {
            console.log(err)
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

passport.deserializeUser(function(id, done) {
    userService.getUserById(id).then( (user) => {
        done(null, user);
    })
});

module.exports = passport;