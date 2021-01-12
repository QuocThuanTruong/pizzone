const formidable = require('formidable');
const userService = require('../user/service')


exports.register = async (req, res, next) => {
    const form = formidable({multiples: true})

    await form.parse(req, async (err, fields, files) => {
        if (err) {
            return
        }

        let username = fields.username;
        let email = fields.email;
        let password = fields.password;

        const _ = await userService.addNewUser(username, email, password, 0)

        res.redirect('/verify?is_new=1&email=' + email);

    })
}

exports.logout = (req, res, next) => {
    req.logout()

    res.redirect('/');
}

