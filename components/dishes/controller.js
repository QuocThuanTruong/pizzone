const dishModel = require('./model')

exports.index = async (req, res, next) => {
    const categoryId = req.query.category;

    let isPizzaCatActive = true;
    let dishes;

    if (categoryId) {
        dishes = await dishModel.listByCategory(categoryId)

        if (categoryId !== '1') {
            isPizzaCatActive = false;
        }

    } else {
        dishes = await dishModel.dishlist()
    }

    const dataContext = {
        menuPageActive: "active",
        isPizzaCatActive: isPizzaCatActive,
        dishes: dishes
    }

    res.render('../components/dishes/views/index', dataContext);
}

exports.detail = (req, res, next) => {
    res.render('../components/dishes/views/detail', {isPizzaCatActive: true});
}