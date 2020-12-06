exports.index = (req, res, next) => {
    res.render('../components/dishes/views/index', {isPizzaCatActive: true});
}

exports.detail = (req, res, next) => {
    res.render('../components/dishes/views/detail', {isPizzaCatActive: true});
}