const {db} = require('../../dal/db')
const DDiff = require('date-diff')

function execQuery(queryString) {
    return new Promise(data => {
     /*  console.log(queryString)*/

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
exports.totalDishByCategoryAndFilter = async (category, subcategory) => {
    let query = 'SELECT COUNT(DISTINCT(d.dish_id)) as total FROM dishes as d';

    query += ' WHERE';
    query += ' d.category = ' + category + ' AND d.is_active = 1';

    if (subcategory !== '') {
        query += ' AND ';
        query += subcategory;
    }

    query = query.split('%20').join(' ');
    query = query.split('%27').join('\'');

    let result = await execQuery(query);

    return result[0].total
}

exports.listByCategoryAndFilter = async (category, page, totalDishPerPage, subcategory, sortBy) => {
    let query = 'SELECT d.dish_id, d.name, d.category, d.subcategory, d.avatar, d.igredients, d.detail_description, d.price, d.discount, d.rate, d.total_reviews, d.status FROM dishes as d';

    query += ' WHERE';
    query += ' d.category = ' + category + ' AND d.is_active = 1';

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

    let dishes = await execQuery(query);

    for (let i = 0; i < dishes.length; i++) {
        let hotDeal = await this.getHotDealByDishId(dishes[i].dish_id)

        if (hotDeal.length > 0) {
            dishes[i].hasHotDeal = true
            dishes[i].hotDeal = hotDeal[0];
            dishes[i].hotDeal.hotDealPrice = Math.floor(dishes[i].price / 100 * (100 - dishes[i].hotDeal.discount) / 1000) * 1000;
        } else {
            dishes[i].hasHotDeal = false;
        }

        dishes[i].sizes = await this.getListSizeById(dishes[i].dish_id)
    }

    return dishes
}


exports.dishlist = async (page, totalDishPerPage, sortBy) => {
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

    let dishes = await execQuery('SELECT * FROM dishes WHERE is_active = 1 ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage))

    for (let i = 0; i < dishes.length; i++) {
        let hotDeal = await this.getHotDealByDishId(dishes[i].dish_id)

        if (hotDeal.length > 0) {
            dishes[i].hasHotDeal = true
            dishes[i].hotDeal = hotDeal[0];
            dishes[i].hotDeal.hotDealPrice = Math.floor(dishes[i].price / 100 * (100 - dishes[i].hotDeal.discount) / 1000) * 1000;
        } else {
            dishes[i].hasHotDeal = false;
        }

        dishes[i].sizes = await this.getListSizeById(dishes[i].dish_id)
    }

    return dishes;
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

    let dishes = await execQuery('SELECT * FROM dishes WHERE category = ' +categoryId + ' AND is_active = 1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage))

    for (let i = 0; i < dishes.length; i++) {
        let hotDeal = await this.getHotDealByDishId(dishes[i].dish_id)

        if (hotDeal.length > 0) {
            dishes[i].hasHotDeal = true
            dishes[i].hotDeal = hotDeal[0];
            dishes[i].hotDeal.hotDealPrice = Math.floor(dishes[i].price / 100 * (100 - dishes[i].hotDeal.discount) / 1000) * 1000;
        } else {
            dishes[i].hasHotDeal = false;
        }

        dishes[i].sizes = await this.getListSizeById(dishes[i].dish_id)
    }

    return dishes
}

exports.getDishById = async (id) => {
    const dishes = await execQuery('SELECT * FROM dishes WHERE dish_id = ' +id)

    let hotDeal = await this.getHotDealByDishId(id)

    if (hotDeal.length > 0) {
        dishes[0].hasHotDeal = true
        dishes[0].hotDeal = hotDeal[0];
        dishes[0].hotDeal.hotDealPrice = Math.floor(dishes[0].price / 100 * (100 - dishes[0].hotDeal.discount) / 1000) * 1000;


        let today = new Date();
        let end_date = hotDeal[0].end_time;
        let diff = new DDiff(end_date, today);
        dishes[0].hotDeal.countDownTime = diff.seconds()
    } else {
        dishes[0].hasHotDeal = false;
    }

    if (dishes[0].category === 1) {
        dishes[0].isPizza = true;
    }

    return dishes[0]
}

exports.getListSizeById = async (id) => {
    return await execQuery('SELECT * FROM dishes_sizes where dish = ' +id)
}

exports.getListImageById = async (id) => {
    return await execQuery('SELECT * FROM dishes_images where dish = ' +id)
}

exports.getSubCategory = async (categoryId, subcategoryId) => {
    const subCategory = await execQuery('SELECT * FROM dishes_subcategory WHERE subcategory_id = ' +subcategoryId+ ' AND category = ' + categoryId)

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

exports.searchByKeyName = async (keyName, page, totalDishPerPage, sortBy) => {
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

    let query = 'SELECT * FROM dishes WHERE MATCH(name) AGAINST(\''+keyName+'\') AND is_active = 1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage)
    query = query.split('%20').join(' ');
    query = query.split('%27').join('\'');

    let dishes = await execQuery(query)

    for (let i = 0; i < dishes.length; i++) {
        let hotDeal = await this.getHotDealByDishId(dishes[i].dish_id)

        if (hotDeal.length > 0) {
            dishes[i].hasHotDeal = true
            dishes[i].hotDeal = hotDeal[0];
            dishes[i].hotDeal.hotDealPrice = Math.floor(dishes[i].price / 100 * (100 - dishes[i].hotDeal.discount) / 1000) * 1000;
        } else {
            dishes[i].hasHotDeal = false;
        }

        dishes[i].sizes = await this.getListSizeById(dishes[i].dish_id)
    }

    return dishes
}

exports.getListSubcategory = async (id) => {
    return await execQuery('SELECT * FROM dishes_subcategory where category = ' + id + ' and is_active = 1');
}

exports.getHotDealByDishId = async (dish_id) => {
    let today = new Date().toISOString().slice(0, 19).replace('T', ' ')

    return await execQuery('SELECT * FROM hot_deal where dish = '+dish_id+' and start_time <= \'' +today+ '\' and end_time >= \''+today+'\' order by deal_id limit 1')
}

exports.updateView = async (dish) => {
    await execQuery('UPDATE dishes set total_reviews = ' + (dish.total_reviews + 1) + ' where dish_id = ' + dish.dish_id)
}

exports.getSizeByDishIdAndSizeId = async (dish_id, size_id) => {
    let sizeInfo = await  execQuery('SELECT * FROM dishes_sizes where size_id = ' + size_id + ' and dish = ' + dish_id + ' and is_active = 1')

    return sizeInfo[0];
}

exports.totalDishByKeyName = async (keyName) => {
    let query = 'SELECT COUNT(dish_id) as total FROM dishes WHERE MATCH(name) AGAINST(\''+keyName+'\') AND is_active = 1 ';

    query = query.split('%20').join(' ');
    query = query.split('%27').join('\'');

    let result = await execQuery(query);

    return result[0].total
}

exports.getDishesHasHotDeal = async () => {
    let today = new Date().toISOString().slice(0, 19).replace('T', ' ')

    let query = 'SELECT DISTINCT(dish) FROM hot_deal where start_time <= \'' + today + '\' and end_time >= \'' + today + '\'';
    let hotDeals = await execQuery(query);

    let dihes = []

    for (let i = 0; i < hotDeals.length; i++) {
        let dish = await this.getDishById(hotDeals[i].dish)
        dihes.push(dish);
    }

    return dihes;
}
/*
exports.test = async () => {
   await execQuery('UPDATE user SET avatar = \'https://res.cloudinary.com/hcmus-web/image/upload/v1607362757/WebFinalProject/Images/user/1/73083634_2453241641624544_6378836173334249472_o_z20x96.jpg\' where user_id = 1')
    await execQuery('UPDATE user SET avatar = \'https://res.cloudinary.com/hcmus-web/image/upload/v1607362758/WebFinalProject/Images/user/2/125188747_1812004398964904_2867076902945476380_n_k0xc51.jpg\' where user_id = 2')
}*/
