const dishModel = require('./model')

exports.index = async (req, res, next) => {
    const categoryId = req.query.category;

    let isPizzaCatActive = false;
    let isDrinkCatActive = false;
    let isSideCatActive = false;

    let dishes;

    if (categoryId) {
        dishes = await dishModel.listByCategory(categoryId)

        if (categoryId === '1') {
            isPizzaCatActive = true;
        }

        if (categoryId === '2') {
            isDrinkCatActive = true;
        }

        if (categoryId === '3') {
            isSideCatActive = true;
        }

    } else {
        dishes = await dishModel.dishlist()
    }

    const dataContext = {
        menuPageActive: "active",
        isPizzaCatActive: isPizzaCatActive,
        isDrinkCatActive: isDrinkCatActive,
        isSideCatActive: isSideCatActive,
        dishes: dishes
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