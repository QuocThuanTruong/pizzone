const {db} = require('../../dal/db')

const dishModel = require('../dishes/model')
const userModel = require('../user/model')

exports.index = async (req, res, next) => {
    const pizza = await dishModel.pizzaList()
    const drinks = await  dishModel.drinkList()
    const sides = await  dishModel.sideList()

    let admin1 = await userModel.getUserByUsernameAndPassword('qtt1707', 'qtt1707')

    console.log(admin1)

    ///img/home-4/people-1.png

    const dataContext = {
        isLogin: true,
        userID: admin1.user_id,
        userFullName: admin1.name,
        userAvatar: admin1.avatar,
        homePageActive: "active",
        pizza: pizza,
        drinks: drinks,
        sides: sides
    }

    console.log(dataContext)

    res.render('../components/home/views/index', dataContext);
};