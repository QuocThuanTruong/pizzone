const reviewModel = require('./model')

exports.postedReview = async (req, res, next) => {
    let dish_id = req.query.dish_id;
    let commentName = req.query.name;
    let commentEmail = req.query.email;
    let commentMessage = req.query.message;

    await reviewModel.insertReview(dish_id, req.user ? req.user.user_id : 0, commentName, commentEmail, commentMessage);

    let review = await reviewModel.getListReviewByDishId(1, dish_id)

    let totalReviews = await reviewModel.getTotalReviewById(dish_id)
    let totalPage = Math.ceil(totalReviews / (5 * 1.0))

    const data = {
        currentPage: 1,
        totalPage: totalPage,
        review: review,
        user: req.user,
        dish: {
            dish_id: dish_id
        }
    }

    res.send(data);
}

exports.reviewPagination = async (req, res, next) => {
    let currentPage = req.query.page;

    if (currentPage === undefined)
        currentPage = 1;

    let review = await reviewModel.getListReviewByDishId(currentPage, req.params.id)

    let totalReviews = await reviewModel.getTotalReviewById(req.params.id)
    let totalPage = Math.ceil(totalReviews / (5 * 1.0))

    const data = {
        currentPage: currentPage,
        totalPage: totalPage,
        review: review,
        user: req.user,
        dish: {
            dish_id: req.params.id
        }
    }

    res.send(data)
}