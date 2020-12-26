const dishModel = require('./model')
const userModel = require('../user/model')

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category !== undefined)) {
        let categoryId = req.query.category
        let sortBy = '1'

        if (categoryId === undefined)
            categoryId = 0

        let totalDishPerPage = 1

        let totalResult = await dishModel.totalDish();
        let totalPizza = await dishModel.totalPizza();
        let totalDrink = await dishModel.totalDrink();
        let totalSide = await dishModel.totalSide();

        let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

        let isPizzaCatActive = false;
        let isDrinkCatActive = false;
        let isSideCatActive = false;

        let dishes;

        if (categoryId !== 0) {
            dishes = await dishModel.listByCategory(categoryId, 1, totalDishPerPage, sortBy)

            totalResult = await dishModel.totalDishByCategory(categoryId);
            totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

            switch (categoryId) {
                case '1':
                    isPizzaCatActive = true;
                    break;

                case '2':
                    isDrinkCatActive = true;
                    break;

                case '3':
                    isSideCatActive = true;
                    break;
            }
        } else {
            dishes = await dishModel.dishlist(1, totalDishPerPage, sortBy)
        }

        let user = await userModel.getUserByUsernameAndPassword('qtt1707', 'qtt1707')

        const dataContext = {
            menuPageActive: "active",
            itemInCart: global.cart.dishes,
            totalCostInCart: global.cart.totalCostInCart,
            totalDishInCart: global.cart.totalDishInCart,
            isLogin: global.isLogin,
            userID: user.user_id,
            userFullName: user.name,
            userAvatar: user.avatar,
            totalDishPerPageOption1Selected: true,
            totalDishPerPageOption2Selected: false,
            totalDishPerPageOption3Selected: false,
            totalDishPerPageOption4Selected: false,
            totalResult: totalResult,
            totalPizza: totalPizza,
            totalDrink: totalDrink,
            totalSide: totalSide,
            isPizzaCatActive: isPizzaCatActive,
            isDrinkCatActive: isDrinkCatActive,
            isSideCatActive: isSideCatActive,
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
    const doughs = await  dishModel.getListDoughById(id)
    const toppings = await dishModel.getListToppingById(id)
    const sizes = await dishModel.getListSizeById(id)
    const images = await dishModel.getListImageById(id)
    const subCategory = await dishModel.getSubCategory(dish.subcategory)

    let isPizzaCatActive = false;
    let isDrinkCatActive = false;
    let isSideCatActive = false;

    switch (dish.category) {
        case 1:
            isPizzaCatActive = true;
            break;

        case 2:
            isDrinkCatActive = true;
            break;

        case 3:
            isSideCatActive = true;
            break;
    }

    let admin1 = await userModel.getUserByUsernameAndPassword('qtt1707', 'qtt1707')

    const dataContext = {
        menuPageActive: "active",
        isLogin: global.isLogin,
        itemInCart: global.cart.dishes,
        totalCostInCart: global.cart.totalCostInCart,
        totalDishInCart: global.cart.totalDishInCart,
        userID: admin1.user_id,
        userFullName: admin1.name,
        userAvatar: admin1.avatar,
        isPizzaCatActive: isPizzaCatActive,
        isDrinkCatActive: isDrinkCatActive,
        isSideCatActive: isSideCatActive,
        name: dish.name,
        avatar: dish.avatar,
        price: dish.price,
        igredients: dish.igredients,
        detail_description: dish.detail_description,
        subCategoryName: subCategory.name,
        doughs: doughs,
        toppings: toppings,
        sizes: sizes,
        images: images,
        dishes: dish
    }

    res.render('../components/dishes/views/detail', dataContext);
}