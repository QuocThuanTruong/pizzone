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

exports.isExistsVoucher = async (code) => {
    let today = new Date().toISOString().slice(0, 19).replace('T', ' ')

    let result = await execQuery('SELECT * FROM voucher where code = \''+code+'\' and start_date <= \'' +today+ '\' and end_date >= \''+today+'\' and is_active = 1 order by id limit 1')

    return result[0];
}
