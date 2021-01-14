const formidable = require('formidable');
const fs = require('fs')
const path = require('path');
const rimraf = require('rimraf')

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const userModel = require('./model')
const orderModel = require('../order/model')
const userService = require('./service')

exports.order = async (req, res, next) => {
    req.session.currentOrders = await orderModel.getCurrentOrderByUserId(req.user.user_id);
    let successOrders = await orderModel.getSuccessOrderByUserId(req.user.user_id)
    let cancelOrders = await orderModel.getCancelOrderByUserId(req.user.user_id)

    let dataContext = {
        cart: req.user.cart,
        isLogin: true,
        user: req.user,
        currentOrders : req.session.currentOrders,
        successOrders : successOrders,
        cancelOrders: cancelOrders
    }

    res.render('../components/user/views/dummyOrder', dataContext);
}

exports.orderDetail = async (req, res, next) => {
    let order = await orderModel.getOrderById(req.params.id)

    console.log(order)

    let dataContext = {
        cart: req.user.cart,
        isLogin: true,
        user: req.user,
        order: order
    }

    res.render('../components/user/views/dummyDetail', dataContext);
}

exports.index = (req, res, next) => {
    const dataContext = {
        cart: req.user.cart,
        isLogin: req.user ? true : false,
        user: req.user
    }

    res.render('../components/user/views/editProfile', dataContext);
}

exports.edit = async (req, res, next) => {
    const dataContext = {
        cart: req.user.cart,
        isLogin: req.user ? true : false,
        user: req.user
    }

    res.render('../components/user/views/editProfile', dataContext);
}

exports.editInfo = async (req, res, next) => {
    fs.mkdirSync(path.join(__dirname, '..', 'tempImages'), { recursive: true })
    const form = formidable({multiples: true, keepExtensions: true, uploadDir : path.join(__dirname, '..', 'tempImages')})

    let oldUser = req.user

    await form.parse(req, async (err, fields, files) => {
        if (err) {
            return
        }

        let newUser = userModel.modify(fields, req.params.id)
        newUser.user_id = oldUser.user_id;

        const avatarPicker = files.avatarPicker
        if (avatarPicker) {
            if (avatarPicker.name) {
                await cloudinary.uploader.upload(avatarPicker.path,
                    {
                        folder: 'WebFinalProject/Images/user/'+newUser.user_id,
                        public_id: 'avatar',
                        overwrite: true
                    }, (err, res) => {
                        newUser.avatar = res.secure_url
                    })
            }
            else {
                newUser.avatar = ""
            }
        } else {
            newUser.avatar = oldUser.avatar
        }

        fs.rmdirSync(path.join(__dirname, '..', 'tempImages'), {recursive: true})

        console.log(newUser)

        const _ = await userModel.update(newUser)
        const user = await userModel.getUserById(newUser.user_id)

        req.login(user, {}, function(err) {
            if (err) {
                console.log(err)
            }

            const dataContext = {
                cart: req.user.cart,
                isLogin: req.user ? true : false,
                user: req.user
            }

            res.render('../components/user/views/editProfile', dataContext);
        })
    })
}

exports.chagePassword = (req, res, next) => {
    const dataContext = {
        cart: req.user.cart,
        isLogin: true,
        user: req.user
    }

    res.render('../components/user/views/changePassword', dataContext);
}

exports.changePasswordConfirm = async (req, res, next) => {
    let newPassword = req.body.newPassword

    await userService.changePassword(req.user.user_id, newPassword);

    res.redirect('/user/edit')
}

exports.orders = async (req, res, next) => {

    let ordereds = await orderModel.getOrderedByUserId(req.user.user_id);

    const dataContext = {
        cart: req.user.cart,
        isLogin: req.user ? true : false,
        user: req.user,
        currentOrders: currentOrders,
        ordereds: ordereds
    }

    res.render('../components/user/views/orders', dataContext);
}

exports.isLogin = async (req, res, next) => {
    if (req.user) {
        next();
    } else {
        //render ra trang thông báo hay gì đó là cần dăng nhập để tiếp tục nè
        res.redirect('/');
    }
}