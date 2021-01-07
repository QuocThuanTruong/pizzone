require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs')
const session = require("express-session");
const bodyParser = require("body-parser");

require('./components/dishes/helper')(hbs);

const passport = require('./components/auth/passport')

const userRouter = require('./components/user/router');
const homeRouter = require('./components/home/router');
const dishesRouter = require('./components/dishes/router');
const cartRouter = require('./components/cart/router');
const authRouter = require('./components/auth/router');
const orderRouter = require('./components/order/router');
const reviewRouter = require('./components/review/router');
const voucherRouter = require('./components/voucher/router')

const app = express();

//declare global variable
global.cart = {
  itemInCart : [],
  totalCostInCart : 0,
  totalDishInCart : 0
}

global.isActive = {
  isPizzaCatActive: false,
  isDrinkCatActive : false,
  isSideCatActive : false
};

global.totalCost = 0;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// register partials
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/dishes', dishesRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use('/order', orderRouter);
app.use('/review', reviewRouter);
app.use('/voucher', voucherRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('errors/error');
});

module.exports = app;
