const reviewModel = require('./model')

exports.postedReview = async (req, res, next) => {
    let dish_id = req.query.dish_id;
    let commentName = req.query.name;
    let commentEmail = req.query.email;
    let commentMessage = req.query.message;

    await reviewModel.insertReview(dish_id, req.user ? req.user.user_id : 0, commentName, commentEmail, commentMessage);

    let review = await reviewModel.getListReviewByDishId(dish_id)

    res.send(review);
}