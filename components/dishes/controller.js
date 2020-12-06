const dishModel = require('./model')

exports.index = async (req, res, next) => {
    const categoryId = req.query.category;

    let isPizzaCatActive = false;
    let isDrinkCatActive = false;
    let isSideCatActive = false;

    let dishes;

    if (categoryId) {
        dishes = await dishModel.listByCategory(categoryId)

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
        dishes = await dishModel.dishlist()
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
        dishes: dishes
    }

    console.log(await dishModel.totalDish())

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