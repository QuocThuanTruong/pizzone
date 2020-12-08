const {db} = require('../../dal/db')

function execQuery(queryString) {
    return new Promise(data => {
/*        console.log(queryString)*/

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

exports.dishlist = async (page, totalDishPerPage) => {
    return await execQuery('SELECT * FROM dishes WHERE is_active = 1 ORDER BY dish_id LIMIT '+totalDishPerPage+' OFFSET '+((page - 1) * totalDishPerPage))
}

exports.pizzaList = async () => {
    return await execQuery('SELECT * FROM dishes WHERE category = 1 AND is_active = 1')
}

exports.drinkList = async () => {
    return await execQuery('SELECT * FROM dishes WHERE category = 2 AND is_active = 1')
}

exports.sideList = async () => {
    return await execQuery('SELECT * FROM dishes WHERE category = 3 AND is_active = 1')
}

exports.listByCategory = async (categoryId, page, totalDishPerPage) => {
    return await execQuery('SELECT * FROM dishes WHERE category = ' +categoryId + ' AND is_active = 1 ORDER BY dish_id LIMIT '+totalDishPerPage+' OFFSET '+((page - 1) * totalDishPerPage))
}

exports.getDishById = async (id) => {
    const dishes = await execQuery('SELECT * FROM dishes WHERE dish_id = ' +id)

    return dishes[0]
}

exports.getListDoughById = async (id) => {
    return await execQuery('SELECT * FROM dishes_doughs where dish = ' +id)
}

exports.getListToppingById = async (id) => {
    return await execQuery('SELECT * FROM dishes_toppings where dish = ' +id)
}

exports.getListSizeById = async (id) => {
    return await execQuery('SELECT * FROM dishes_sizes where dish = ' +id)
}

exports.getListImageById = async (id) => {
    return await execQuery('SELECT * FROM dishes_images where dish = ' +id)
}

exports.getSubCategory = async (id) => {
    const subCategory = await execQuery('SELECT * FROM dishes_subcategory WHERE subcategory_id = ' +id)

    return subCategory[0]
}

exports.totalDish = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes WHERE is_active = 1')

    return queryResult[0].total
}

exports.totalPizza = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = 1  AND is_active = 1')

    return queryResult[0].total
}

exports.totalDrink = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = 2  AND is_active = 1')

    return queryResult[0].total
}

exports.totalSide = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = 3 AND is_active = 1')

    return queryResult[0].total
}

exports.totalDishByCategory = async (categoryId) => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = '+categoryId+' AND is_active = 1')

    return queryResult[0].total
}

exports.searchByKeyName = async (keyName) => {
    return await execQuery('SELECT * FROM dishes WHERE name LIKE \'%'+keyName+'%\' AND is_active = 1')
}

/*
exports.test = async () => {
   await execQuery('UPDATE user SET avatar = \'https://res.cloudinary.com/hcmus-web/image/upload/v1607362757/WebFinalProject/Images/user/1/73083634_2453241641624544_6378836173334249472_o_z20x96.jpg\' where user_id = 1')
    await execQuery('UPDATE user SET avatar = \'https://res.cloudinary.com/hcmus-web/image/upload/v1607362758/WebFinalProject/Images/user/2/125188747_1812004398964904_2867076902945476380_n_k0xc51.jpg\' where user_id = 2')
}*/
