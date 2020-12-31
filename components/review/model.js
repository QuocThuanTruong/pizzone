const {db} = require('../../dal/db')

function execQuery(queryString) {
    return new Promise(data => {
        /*        console.log(queryString)*/

        db.query(queryString, (err, results, fields) => {
            if (err) {
                console.log(err)
            } else {
                try {
                    data(results);
                } catch (error) {
                    data({});
                    throw error;
                }
            }
        })
    })
}

exports.getListReviewByDishId = async (dish_id) => {
    let reviews = await execQuery('SELECT * FROM dishes_review where dish = ' + dish_id)

    for (let i = 0; i < reviews.length; i++) {
        let avatar = await execQuery('SELECT avatar as a FROM user where user_id = ' + reviews[i].user)

        if (avatar.length > 0) {
            reviews[i].avatar = avatar[0].a
        } else {
            reviews[i].avatar = '/img/user_avatar.jpg'
        }

    }

    return reviews;
}

exports.insertReview = async (dish_id, user_id, name, email, message) => {
    let review_id = await this.getMaxReviewId() + 1;

    await execQuery('INSERT INTO dishes_review(review_id, dish, user, parent_review, name, email, rate, comment, is_active) VALUES ('+review_id+','+dish_id+','+user_id+', 0,N\''+name+'\',N\''+email+'\',0,N\''+message+'\',1)')
}

exports.getMaxReviewId = async () => {
    const result = await execQuery('SELECT MAX(review_id) as max from dishes_review')

    return result[0].max
}
