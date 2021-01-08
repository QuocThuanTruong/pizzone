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

        let subcategories = await dishModel.getListSubcategory(categoryId)

        let result = {
            totalResult : await dishModel.totalDish(),
            totalPizza : await dishModel.totalPizza(),
            totalDrink : await dishModel.totalDrink(),
            totalSide : await dishModel.totalSide()
        }

        let totalPage = Math.ceil(result.totalResult / (totalDishPerPage * 1.0))

        let dishes;
        let isActive = {
            isPizzaCatActive : false,
            isDrinkCatActive : false,
            isSideCatActive : false,
        }

        if (categoryId !== 0) {
            dishes = await dishModel.listByCategory(categoryId, 1, totalDishPerPage, sortBy)

            result.totalResult = await dishModel.totalDishByCategory(categoryId);
            totalPage = Math.ceil(result.totalResult / (totalDishPerPage * 1.0))

            switch (categoryId) {
                case '1':
                    isActive.isPizzaCatActive = true;
                    isActive.isDrinkCatActive = false;
                    isActive.isSideCatActive = false;
                    break;

                case '2':
                    isActive.isPizzaCatActive = false;
                    isActive.isDrinkCatActive = true;
                    isActive.isSideCatActive = false;
                    break;

                case '3':
                    isActive.isPizzaCatActive = false;
                    isActive.isDrinkCatActive = false;
                    isActive.isSideCatActive = true;
                    break;
            }
        } else {
            dishes = await dishModel.dishlist(1, totalDishPerPage, sortBy)
        }

        let cart = {}

        if (req.user) {
            cart = req.user.cart
        } else {
            if (req.session.cart) {
                cart = req.session.cart
            } else {
                cart = {
                    itemInCart : [],
                    totalCostInCart : 0,
                    totalDishInCart : 0
                }
            }
        }

        const dataContext = {
            menuPageActive: "active",
            isLogin: req.user ? true : false,
            user: req.user,
            cart: cart,
            result: result,
            isActive: isActive,
            dishes: dishes,
            totalPage: totalPage,
            page: 1,
            category: categoryId,
            subcategories: subcategories
        }

        req.session.oldURL = req.originalUrl;
        res.render('../components/dishes/views/index', dataContext);
    } else {
        this.pagination(req, res, next)
    }
}

exports.pagination = async (req, res, next) => {
    let keyName = req.query.key_name;
    let categoryId = req.query.category;
    let currentPage = req.query.page;
    let totalDishPerPage = req.query.total_dish_per_page;
    let subcategory = req.query.subcategory;
    let sortBy = req.query.sortBy;

    if (subcategory === undefined) {
        subcategory = ''
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

    if (keyName !== undefined) {
        dishes = await dishModel.searchByKeyName(keyName, currentPage, totalDishPerPage, sortBy)
        totalResult = await dishModel.totalDishByKeyName(keyName);

    } else {
        if (categoryId !== 0) {
            dishes = await dishModel.listByCategoryAndFilter(categoryId, currentPage, totalDishPerPage, subcategory, sortBy);
            totalResult = await dishModel.totalDishByCategoryAndFilter(categoryId, subcategory);

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
    }

    res.send(data)
}

exports.detail = async (req, res, next) => {
    const id = req.params.id

    const dish = await dishModel.getDishById(id)
    dish.sizes = await dishModel.getListSizeById(id)
    dish.images = await dishModel.getListImageById(id)
    const subcategoryName = await dishModel.getSubCategory(dish.category, dish.subcategory)
    dish.subcategoryName = subcategoryName.name

    let isActive = {
        isPizzaCatActive : false,
        isDrinkCatActive : false,
        isSideCatActive : false,
    }

    switch (dish.category) {
        case 1:
            isActive.isPizzaCatActive = true;
            isActive.isDrinkCatActive = false;
            isActive.isSideCatActive = false;
            break;

        case 2:
            isActive.isPizzaCatActive = false;
            isActive.isDrinkCatActive = true;
            isActive.isSideCatActive = false;
            break;

        case 3:
            isActive.isPizzaCatActive = false;
            isActive.isDrinkCatActive = false;
            isActive.isSideCatActive = true;
            break;
    }

    let review = await reviewModel.getListReviewByDishId(id)

    let cart = {}

    if (req.user) {
        cart = req.user.cart
    } else {
        if (req.session.cart) {
            cart = req.session.cart
        } else {
            cart = {
                itemInCart : [],
                totalCostInCart : 0,
                totalDishInCart : 0
            }
        }
    }

    const dataContext = {
        menuPageActive: "active",
        isLogin: req.user ? true : false,
        user: req.user,
        cart: cart,
        isActive : isActive,
        dish: dish,
        review: review
    }

    await dishModel.updateView(dish);

    req.session.oldURL = req.originalUrl;

    res.render('../components/dishes/views/detail', dataContext);
}