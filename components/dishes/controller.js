const dishModel = require('./model')
const userModel = require('../user/model')
const reviewModel = require('../review/model')

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category !== undefined) || (Object.keys(req.query).length === 1 && req.query.name !== undefined)) {
        let keyName = req.query.name;
        let categoryId = req.query.category
        let sortBy = '1'
        let byCategory = false;

        if (categoryId === undefined) {
            categoryId = 0
        } else {
            byCategory = true;
        }

        if (req.session.totalDishPerPage === undefined) {
            req.session.totalDishPerPage = 1
        }

        let totalDishPerPage = parseInt(req.session.totalDishPerPage)

        let totalDishPerPageOption = {
            option1: false,
            option2: false,
            option3: false,
            option4: false
        }
        switch (totalDishPerPage) {
            case 1 :
                totalDishPerPageOption.option1 = true;
                totalDishPerPageOption.option2 = false;
                totalDishPerPageOption.option3 = false;
                totalDishPerPageOption.option4 = false;
                break;
            case 2 :
                totalDishPerPageOption.option1 = false;
                totalDishPerPageOption.option2 = true;
                totalDishPerPageOption.option3 = false;
                totalDishPerPageOption.option4 = false;
                break;
            case 3 :
                totalDishPerPageOption.option1 = false;
                totalDishPerPageOption.option2 = false;
                totalDishPerPageOption.option3 = true;
                totalDishPerPageOption.option4 = false;
                break;
            case 4 :
                totalDishPerPageOption.option1 = false;
                totalDishPerPageOption.option2 = false;
                totalDishPerPageOption.option3 = false;
                totalDishPerPageOption.option4 = true;
                break;
        }

        let subcategories = await dishModel.getListSubcategory(categoryId)

        let result = {
            totalResult : await dishModel.totalDish(0, 1000000),
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

        if (keyName !== undefined) {
            dishes = await dishModel.searchByKeyName(keyName, 0, 1000000, 1, totalDishPerPage, sortBy)
            result.totalResult = await dishModel.totalDishByKeyName(keyName, 0, 1000000);
        } else if (categoryId !== 0) {
            dishes = await dishModel.listByCategory(categoryId, 0, 1000000, 1, totalDishPerPage, sortBy)

            result.totalResult = await dishModel.totalDishByCategory(categoryId, 0, 1000000);
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
            dishes = await dishModel.dishlist(1, 0, 1000000, totalDishPerPage, sortBy)
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
            totalDishPerPageOption: totalDishPerPageOption,
            isActive: isActive,
            dishes: dishes,
            totalPage: totalPage,
            page: 1,
            category: categoryId,
            subcategories: subcategories,
            byCategory: byCategory
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
    let minPrice = req.query.min;
    let maxPrice = req.query.max;

    if (subcategory === undefined) {
        subcategory = ''
    }

    if (categoryId === undefined || categoryId === "")
        categoryId = 0

    if (currentPage === undefined)
        currentPage = 1;

    if (totalDishPerPage === undefined)
        totalDishPerPage = parseInt(req.session.totalDishPerPage);
    else {
        req.session.totalDishPerPage = parseInt(totalDishPerPage);
    }

    if (sortBy === undefined) {
        sortBy = 1;
    }

    let dishes;
    let totalResult = await dishModel.totalDish(minPrice, maxPrice);
    let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

    if (keyName !== undefined) {
        dishes = await dishModel.searchByKeyName(keyName, minPrice, maxPrice, currentPage, totalDishPerPage, sortBy)
        totalResult = await dishModel.totalDishByKeyName(keyName, minPrice, maxPrice);

    } else {
        if (categoryId !== 0) {
            dishes = await dishModel.listByCategoryAndFilter(categoryId, minPrice, maxPrice, currentPage, totalDishPerPage, subcategory, sortBy);
            totalResult = await dishModel.totalDishByCategoryAndFilter(categoryId, minPrice, maxPrice, subcategory);

            totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))
        } else {
            dishes = await dishModel.dishlist(currentPage, minPrice, maxPrice, totalDishPerPage, sortBy)
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
    let subcategoryName = await dishModel.getSubCategory(dish.category, dish.subcategory)
    dish.subcategoryName = subcategoryName.name

    let isActive = {
        isPizzaCatActive : false,
        isDrinkCatActive : false,
        isSideCatActive : false,
    }

    let otherDishType1 = [];
    let otherDishType2 = [];

    switch (dish.category) {
        case 1:
            isActive.isPizzaCatActive = true;
            isActive.isDrinkCatActive = false;
            isActive.isSideCatActive = false;

            otherDishType1 = await dishModel.listByCategory(2, 0, 1000000, 1, 2, '1')
            otherDishType2 = await dishModel.listByCategory(3, 0, 1000000,1, 2, '1')
            break;

        case 2:
            isActive.isPizzaCatActive = false;
            isActive.isDrinkCatActive = true;
            isActive.isSideCatActive = false;

            otherDishType1 = await dishModel.listByCategory(1, 0, 1000000,1, 2, '1')
            otherDishType2 = await dishModel.listByCategory(3, 0, 1000000,1, 2, '1')
            break;

        case 3:
            isActive.isPizzaCatActive = false;
            isActive.isDrinkCatActive = false;
            isActive.isSideCatActive = true;

            otherDishType1 = await dishModel.listByCategory(1, 0, 1000000,1, 2, '1')
            otherDishType2 = await dishModel.listByCategory(2, 0, 1000000,1, 2, '1')
            break;
    }

    let otherDishResult = [];

    for (let i = 0; i < otherDishType1.length; i++) {
        subcategoryName = await dishModel.getSubCategory(otherDishType1[i].category, otherDishType1[i].subcategory)
        otherDishType1[i].subcategoryName = subcategoryName.name
        otherDishResult.push(otherDishType1[i])
    }

    for (let i = 0; i < otherDishType2.length; i++) {
        subcategoryName = await dishModel.getSubCategory(otherDishType2[i].category, otherDishType2[i].subcategory)
        otherDishType2[i].subcategoryName = subcategoryName.name
        otherDishResult.push(otherDishType2[i])
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
        otherDish: otherDishResult,
        review: review
    }

    await dishModel.updateView(dish);

    req.session.oldURL = req.originalUrl;

    res.render('../components/dishes/views/detail', dataContext);
}