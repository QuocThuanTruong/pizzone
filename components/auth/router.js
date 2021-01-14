const express = require('express');
const router = express.Router();
const controller = require('./controller')
const passport = require('./passport')
const cartModel = require('../cart/model')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const userService = require("../user/service");
const userModel = require('../user/model')

router.post('/register', controller.register)

router.post('/login',
    passport.authenticate('local'),
    function(req, res, next) {
        if (req.user.name ==='') {
            res.redirect('/user/edit')
        }

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
let isNew = false;

router.post('/send', async function(req, res, next) {
    if (req.body.isNewUser) {
        isNew = true;
    }

    let email = req.body.verifyEmail


    rand = Math.floor((Math.random() * 100) + 54);
    host=req.get('host');


    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(rand + '', salt)

    console.log('email ' + req.body.verifyEmail)

    console.log('id verify ' + rand)

    link="http://"+req.get('host')+"/auth/verify?id="+hash + '&email=' + email;

    let transporter =  nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_SMTP_USER,
            pass: process.env.GMAIL_SMTP_PASSWORD
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
            res.redirect('/verify')
        } else {
            console.log('Message sent: ' +  info.response);
           res.redirect('/resend?email=' + email)
        }
    });
});


let isverify = false;

router.get('/verify', async function(req,res, next){
    console.log(req.protocol+":/"+req.get('host'));


    if((req.protocol+"://"+req.get('host')) === ("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        console.log(req.query.id)

        let equal = await bcrypt.compareSync(rand.toString(), req.query.id.toString())

        if(equal)
        {
            console.log("email is verified");
            req.isverify = true;

            if (isNew) {

                let user_id = await  userModel.getUserIDPassiveByEmail(req.query.email)
                let user = await userModel.getUserToLogin(user_id)
                await  userModel.activeUser(user_id, 1)

                console.log(user_id)

                res.redirect('/login')
                // req.login(user, {}, function(err) {
                //     res.redirect('/user/edit/')
                // })
            } else {

                res.redirect('/recover-password?email=' + req.query.email)
            }

        }
        else
        {
            console.log("email is not verified");
            req.isverify = false
            res.redirect('/resend?status=0&email=' + req.query.email)

        }
    }
    else
    {
        res.end("<h1>Request is from unknown source</h1>");
    }

});


exports.isVerify = (req, res, next) => {

    console.log(req.isverify)

    if (req.isverify) {

        next();
    } else {
        res.redirect('/');
    }
}


module.exports = router;