const {db} = require('../../dal/db')

function execQuery(queryString) {
    return new Promise(data => {
        db.query(queryString, (err, results, fields) => {
            if (err) {
                console.log(err)
            } else {
                try {
                    data(results);
                } catch (error) {
                    data({});
                    throw error;
                }
            }
        })
    })
}

exports.dishlist = async () => {
    return await execQuery('SELECT * FROM dishes')
}

exports.pizzaList = async () => {
    return await execQuery('SELECT * FROM dishes WHERE category = 1')
}

exports.drinkList = async () => {
    return await execQuery('SELECT * FROM dishes WHERE category = 2')
}

exports.sideList = async () => {
    return await execQuery('SELECT * FROM dishes WHERE category = 3')
}

exports.listByCategory = async (categoryId) => {
    return await execQuery('SELECT * FROM dishes WHERE category ='+categoryId)
}