const dishModel = require('./model')

exports.index = async (req, res, next) => {
    let categoryId = req.query.category;
    let currentPage = req.query.page;
    let totalDishPerPage = req.query.total_dish_per_page;

    console.log(req.query)

    if (categoryId === undefined || categoryId === "")
        categoryId = 0

    if (currentPage === undefined)
        currentPage = 1;

    if (totalDishPerPage === undefined)
        totalDishPerPage = 8

    let totalPage = Math.ceil(await dishModel.totalDish() / (totalDishPerPage * 1.0))

    let isPizzaCatActive = false;
    let isDrinkCatActive = false;
    let isSideCatActive = false;

    let dishes;

    if (categoryId !== 0) {
        dishes = await dishModel.listByCategory(categoryId, currentPage, totalDishPerPage)

        switch (categoryId) {
            case '1':
                isPizzaCatActive = true;
                totalPage = Math.ceil(await dishModel.totalPizza() / (totalDishPerPage * 1.0))
                break;

            case '2':
                isDrinkCatActive = true;
                totalPage = Math.ceil(await dishModel.totalDrink() / (totalDishPerPage * 1.0))
                break;

            case '3':
                isSideCatActive = true;
                totalPage = Math.ceil(await dishModel.totalSide() / (totalDishPerPage * 1.0))
                break;
        }
    } else {
        dishes = await dishModel.dishlist(currentPage, totalDishPerPage)
    }

    const dataContext = {
        menuPageActive: "active",
        totalResult: await dishModel.totalDish(),
        totalPizza: await dishModel.totalPizza(),
        totalDrink: await dishModel.totalDrink(),
        totalSide: await dishModel.totalSide(),
        isPizzaCatActive: isPizzaCatActive,
        isDrinkCatActive: isDrinkCatActive,
        isSideCatActive: isSideCatActive,
        dishes: dishes,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId
    }

    res.render('../components/dishes/views/index', dataContext);
}

exports.detail = async (req, res, next) => {
    const id = req.params.id

    const dish = await dishModel.getDishById(id)
    const doughs = await  dishModel.getLístDoughById(id)
    const toppings = await dishModel.getLístToppingById(id)
    const sizes = await dishModel.getLístSizeById(id)
    const images = await dishModel.getLístImageById(id)
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

    const dataContext = {
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