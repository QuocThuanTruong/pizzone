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
    return await execQuery('SELECT * FROM dishes WHERE category =' +categoryId)
}

exports.getDishById = async (id) => {
    const dishes = await execQuery('SELECT * FROM dishes WHERE dish_id = ' +id)

    return dishes[0]
}

exports.getLístDoughById = async (id) => {
    return await execQuery('SELECT * FROM dishes_doughs where dish = ' +id)
}

exports.getLístToppingById = async (id) => {
    return await execQuery('SELECT * FROM dishes_toppings where dish = ' +id)
}

exports.getLístSizeById = async (id) => {
    return await execQuery('SELECT * FROM dishes_sizes where dish = ' +id)
}

exports.getLístImageById = async (id) => {
    return await execQuery('SELECT * FROM dishes_images where dish = ' +id)
}

exports.getSubCategory = async (id) => {
    const subCategory = await execQuery('SELECT * FROM dishes_subcategory WHERE subcategory_id = ' +id)

    return subCategory[0]
}

exports.totalDish = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes')

    return queryResult[0].total
}

exports.totalPizza = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = 1')

    return queryResult[0].total
}

exports.totalDrink = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = 2')

    return queryResult[0].total
}

exports.totalSide = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = 3')

    return queryResult[0].total
}