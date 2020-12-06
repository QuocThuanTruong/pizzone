const {db} = require('../../dal/db')

exports.index = async (req, res, next) => {
    res.render('../components/home/views/index', {});
};