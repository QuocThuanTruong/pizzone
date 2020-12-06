const dishModel = require('./model')

exports.index = async (req, res, next) => {
    const dishes = await dishModel.dishlist()

    const dataContext = {
        isisPizzaCatActive: true,
        dishes: dishes
    }

    res.render('../components/dishes/views/index', dataContext);
}

exports.detail = (req, res, next) => {
    res.render('../components/dishes/views/detail', {isPizzaCatActive: true});
}