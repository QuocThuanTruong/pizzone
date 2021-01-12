const express = require('express');
const router = express.Router();
const controller = require('./controller')
const passport = require('./passport')
const cartModel = require('../cart/model')
const nodemailer = require('nodemailer')

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

let rand, mailOptions, host, link;

router.post('/send', function(req, res, next) {


    rand = Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/auth/verify?id="+rand;

    let email = req.body.verifyEmail


    console.log('email ' + req.body.verifyEmail)

    console.log('id verify ' + rand)

    let transporter =  nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'ltweb1831.hcmus@gmail.com',
            pass: 'Ltweb123#'
        }
    });

    let mainOptions = {
        from: 'Pizzone',
        to: email,
        subject: '[Pizzone] Xác thực email',
        text: 'You recieved message from ' +req.body.verifyEmail,
        html: "<a href=" + link + "> Nhấp vào link để xác thực</a>"
    }

    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            res.send({"status": 400});
        } else {
            console.log('Message sent: ' +  info.response);
            res.redirect('/auth/send')
        }
    });


});

router.get('/verify', function(req,res, next){
    console.log(req.protocol+":/"+req.get('host'));

    if((req.protocol+"://"+req.get('host')) === ("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        console.log(req.query.id)

        if(req.query.id == rand)
        {
            console.log("email is verified");
            res.end("<h1>Xác thực thành công</h1>");
        }
        else
        {
            console.log("email is not verified");
            res.end("<h1>Xác thực không thành công</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
});




module.exports = router;