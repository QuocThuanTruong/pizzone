const dishModel = require('./model')
const userModel = require('../user/model')
const reviewModel = require('../review/model')

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category !== undefined)) {
        let categoryId = req.query.category
        let sortBy = '1'

        if (categoryId === undefined)
            categoryId = 0

        let totalDishPerPage = 1

        let result = {
            totalResult : await dishModel.totalDish(),
            totalPizza : await dishModel.totalPizza(),
            totalDrink : await dishModel.totalDrink(),
            totalSide : await dishModel.totalSide()
        }

        let totalPage = Math.ceil(result.totalResult / (totalDishPerPage * 1.0))

        let dishes;

        if (categoryId !== 0) {
            dishes = await dishModel.listByCategory(categoryId, 1, totalDishPerPage, sortBy)

            result.totalResult = await dishModel.totalDishByCategory(categoryId);
            totalPage = Math.ceil(result.totalResult / (totalDishPerPage * 1.0))

            switch (categoryId) {
                case '1':
                    global.isActive.isPizzaCatActive = true;
                    global.isActive.isDrinkCatActive = false;
                    global.isActive.isSideCatActive = false;
                    break;

                case '2':
                    global.isActive.isPizzaCatActive = false;
                    global.isActive.isDrinkCatActive = true;
                    global.isActive.isSideCatActive = false;
                    break;

                case '3':
                    global.isActive.isPizzaCatActive = false;
                    global.isActive.isDrinkCatActive = false;
                    global.isActive.isSideCatActive = true;
                    break;
            }
        } else {
            dishes = await dishModel.dishlist(1, totalDishPerPage, sortBy)
        }

        const dataContext = {
            menuPageActive: "active",
            isLogin: req.user ? true : false,
            user: req.user,
            cart: req.user ? req.user.cart : global.cart,
            result: result,
            isActive: global.isActive,
            dishes: dishes,
            totalPage: totalPage,
            page: 1,
            category: categoryId
        }

        res.render('../components/dishes/views/index', dataContext);
    } else {
        this.pagination(req, res, next)
    }
}

exports.pagination = async (req, res, next) => {
    const key_name = req.query.key_name

    let categoryId = req.query.category;
    let currentPage = req.query.page;
    let totalDishPerPage = req.query.total_dish_per_page;
    let subcategory = req.query.subcategory;
    let size = req.query.size;
    let topping = req.query.topping;
    let dough = req.query.dough;
    let sortBy = req.query.sortBy;

    if (subcategory === undefined) {
        subcategory = ''
    }

    if (size === undefined) {
        size = ''
    } else {
        size = size.split('%20').join(' ');
        size = size.split('%27').join('\'')
    }

    if (topping === undefined) {
        topping = ''
    } else {
        topping = topping.split('%20').join(' ');
        topping = topping.split('%27').join('\'')
    }

    if (dough === undefined) {
        dough = ''
    } else {
        dough = dough.split('%20').join(' ');
        dough = dough.split('%27').join('\'')
    }

    if (categoryId === undefined || categoryId === "")
        categoryId = 0

    if (currentPage === undefined)
        currentPage = 1;

    if (totalDishPerPage === undefined)
        totalDishPerPage = 1

    let dishes;
    let totalResult = await dishModel.totalDish();
    let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

    if (key_name !== undefined) {
        dishes = await dishModel.searchByKeyName(key_name)
    } else {
        if (categoryId !== 0) {
            dishes = await dishModel.listByCategoryAndFilter(categoryId, currentPage, totalDishPerPage, subcategory, size, topping, dough, sortBy);
            totalResult = await dishModel.totalDishByCategoryAndFilter(categoryId, subcategory, size, topping, dough);

            totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))
        } else {
            dishes = await dishModel.dishlist(currentPage, totalDishPerPage, sortBy)
        }
    }

    const data = {
        category: categoryId,
        currentPage: currentPage,
        totalPage: totalPage,
        totalResult: totalResult,
        dishes: dishes,
        subcategory: subcategory,
        size: size,
        topping: topping,
        dough: dough
    }

    res.send(data)
}

exports.detail = async (req, res, next) => {
    const id = req.params.id

    const dish = await dishModel.getDishById(id)
    dish.doughs = await  dishModel.getListDoughById(id)
    dish.toppings = await dishModel.getListToppingById(id)
    dish.sizes = await dishModel.getListSizeById(id)
    dish.images = await dishModel.getListImageById(id)
    const subCategory = await dishModel.getSubCategory(dish.subcategory)
    dish.subCategoryName = subCategory.name

    switch (dish.category) {
        case 1:
            global.isActive.isPizzaCatActive = true;
            global.isActive.isDrinkCatActive = false;
            global.isActive.isSideCatActive = false;
            break;

        case 2:
            global.isActive.isPizzaCatActive = false;
            global.isActive.isDrinkCatActive = true;
            global.isActive.isSideCatActive = false;
            break;

        case 3:
            global.isActive.isPizzaCatActive = false;
            global.isActive.isDrinkCatActive = false;
            global.isActive.isSideCatActive = true;
            break;
    }

    let review = await reviewModel.getListReviewByDishId(id)

    const dataContext = {
        menuPageActive: "active",
        isLogin: req.user ? true : false,
        user: req.user,
        cart: req.user ? req.user.cart : global.cart,
        isActive : global.isActive,
        dish: dish,
        review: review
    }

    res.render('../components/dishes/views/detail', dataContext);
}