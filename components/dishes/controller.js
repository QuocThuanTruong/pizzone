const dishModel = require('./model')
const userModel = require('../user/model')

exports.index = async (req, res, next) => {
    const key_name = req.query.key_name

    let categoryId = req.query.category;
    let currentPage = req.query.page;
    let totalDishPerPage = req.query.total_dish_per_page;

/*    console.log(req.query)*/

    if (categoryId === undefined || categoryId === "")
        categoryId = 0

    if (currentPage === undefined)
        currentPage = 1;

    if (totalDishPerPage === undefined)
        totalDishPerPage = 1

    let totalPage = Math.ceil(await dishModel.totalDish() / (totalDishPerPage * 1.0))

    let isPizzaCatActive = false;
    let isDrinkCatActive = false;
    let isSideCatActive = false;

    let dishes;
    let totalResult = await dishModel.totalDish();
    let totalPizza = await dishModel.totalPizza();
    let totalDrink = await dishModel.totalDrink();
    let totalSide = await dishModel.totalSide();

    let totalDishPerPageOption1Selected = false;
    let totalDishPerPageOption2Selected = false;
    let totalDishPerPageOption3Selected = false;
    let totalDishPerPageOption4Selected = false;

    switch (totalDishPerPage) {
        case '1':
            totalDishPerPageOption1Selected = true;
            break;
        case '2':
            totalDishPerPageOption2Selected = true;
            break;
        case '3':
            totalDishPerPageOption3Selected = true;
            break;
        case '4':
            totalDishPerPageOption4Selected = true;
            break;
    }

    if (key_name !== undefined) {
        dishes = await dishModel.searchByKeyName(key_name)
        totalResult = dishes.length
    } else {
        if (categoryId !== 0) {
            dishes = await dishModel.listByCategory(categoryId, currentPage, totalDishPerPage)
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
            dishes = await dishModel.dishlist(currentPage, totalDishPerPage)
        }
    }

    let admin1 = await userModel.getUserByUsernameAndPassword('qtt1707', 'qtt1707')

    const dataContext = {
        menuPageActive: "active",
        isLogin: true,
        userID: admin1.user_id,
        userFullName: admin1.name,
        userAvatar: admin1.avatar,
        totalDishPerPageOption1Selected: totalDishPerPageOption1Selected,
        totalDishPerPageOption2Selected: totalDishPerPageOption2Selected,
        totalDishPerPageOption3Selected: totalDishPerPageOption3Selected,
        totalDishPerPageOption4Selected: totalDishPerPageOption4Selected,
        totalResult: totalResult,
        totalPizza: totalPizza,
        totalDrink: totalDrink,
        totalSide: totalSide,
        isPizzaCatActive: isPizzaCatActive,
        isDrinkCatActive: isDrinkCatActive,
        isSideCatActive: isSideCatActive,
        dishes: dishes,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId
    }

/*    console.log(dataContext)*/

    res.render('../components/dishes/views/index', dataContext);
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
        isLogin: true,
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
        menuPageActive: "active",
        dishes: dish
    }

    res.render('../components/dishes/views/detail', dataContext);
}