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
exports.totalDishByCategoryAndFilter = async (category, subcategory, size, topping, dough) => {
    let query = 'SELECT COUNT(DISTINCT(d.dish_id)) as total FROM dishes as d';

    if (size !== '') {
        query += ', dishes_sizes as ds';
    }

    if (topping !== '') {
        query += ', dishes_toppings as dt';
    }

    if (dough !== '') {
        query += ', dishes_doughs as dd';
    }

    query += ' WHERE';
    query += ' d.category = ' + category + ' AND d.is_active = 1';

    if (size !== '') {
        query += ' AND d.dish_id = ds.dish';
        query += ' AND ';
        query += size;
    }

    if (topping !== '') {
        query += ' AND d.dish_id = dt.dish';
        query += ' AND ';
        query += topping;
    }

    if (dough !== '') {
        query += ' AND d.dish_id = dd.dish';
        query += ' AND ';
        query += dough;
    }

    if (subcategory !== '') {
        query += ' AND ';
        query += subcategory;
    }

    query = query.split('%20').join(' ');
    query = query.split('%27').join('\'');

    let result = await execQuery(query);

    console.log(result);

    return result[0].total
}

exports.listByCategoryAndFilter = async (category, page, totalDishPerPage, subcategory, size, topping, dough, sortBy) => {
    let query = 'SELECT DISTINCT d.dish_id, d.name, d.category, d.subcategory, d.avatar, d.igredients, d.detail_description, d.price, d.discount, d.rate, d.total_reviews, d.status FROM dishes as d';

    if (size !== '') {
        query += ', dishes_sizes as ds';
    }

    if (topping !== '') {
        query += ', dishes_toppings as dt';
    }

    if (dough !== '') {
        query += ', dishes_doughs as dd';
    }

    query += ' WHERE';
    query += ' d.category = ' + category + ' AND d.is_active = 1';

    if (size !== '') {
        query += ' AND d.dish_id = ds.dish';
        query += ' AND ';
        query += size;
    }

    if (topping !== '') {
        query += ' AND d.dish_id = dt.dish';
        query += ' AND ';
        query += topping;
    }

    if (dough !== '') {
        query += ' AND d.dish_id = dd.dish';
        query += ' AND ';
        query += dough;
    }

    if (subcategory !== '') {
        query += ' AND ';
        query += subcategory;
    }

    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'd.created_date';
            break;
        case '2':
            sort = 'd.name';
            break;
        case '3':
            sort = 'd.price DESC';
            break;
        case '4':
            sort = 'd.price ASC';
            break;
    }


    query += ' ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' + ((page - 1) * totalDishPerPage);

    query = query.split('%20').join(' ');
    query = query.split('%27').join('\'');

    console.log(query);

    return await execQuery(query);
    // as d, dishes_sizes as ds WHERE d.dish_id = ds.dish and ds.name = N\'25cm (250g)\' or ds.name = N\'30cm (450g)\' or ds.name = N\'40cm (550g)\'';
}


exports.dishlist = async (page, totalDishPerPage, sortBy) => {
    console.log(sortBy)

    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'created_date';
            break;
        case '2':
            sort = 'name';
            break;
        case '3':
            sort = 'price DESC';
            break;
        case '4':
            sort = 'price ASC';
            break;
    }

    return await execQuery('SELECT * FROM dishes WHERE is_active = 1 ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage))
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

exports.listByCategory = async (categoryId, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'created_date';
            break;
        case '2':
            sort = 'name';
            break;
        case '3':
            sort = 'price DESC';
            break;
        case '4':
            sort = 'price ASC';
            break;
    }

    return await execQuery('SELECT * FROM dishes WHERE category = ' +categoryId + ' AND is_active = 1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage))
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
