exports.index = (req, res, next) => {
    res.render('../components/dishes/dishesIndex', {isPizzaCatActive: true});
}