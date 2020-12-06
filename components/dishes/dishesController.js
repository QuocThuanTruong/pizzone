exports.index = (req, res, next) => {
    res.render('../components/dishes/dishesIndex', {isPizzaCatActive: true});
}

exports.detail = (req, res, next) => {
    res.render('../components/dishes/dishDetailIndex', {isPizzaCatActive: true});
}