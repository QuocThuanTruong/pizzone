const formidable = require('formidable');
const fs = require('fs')
const path = require('path');
const rimraf = require('rimraf')

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const userModel = require('./model')

exports.index = (req, res, next) => {
    const dataContext = {
        isLogin: true,
        userFullName: "Nguyen Van A",
    }

    res.render('../components/user/views/editProfile', dataContext);
}

exports.edit = async (req, res, next) => {
    const id = req.params.id

    const user = await userModel.getUserById(id)

    const dataContext = {
        isLogin: true,
        userID: user.user_id,
        userFullName: user.name,
        userAvatar: user.avatar,
        email: user.email,
        phone: user.phone,
        address: user.address
    }

    res.render('../components/user/views/editProfile', dataContext);
}

exports.editInfo = async (req, res, next) => {
    fs.mkdirSync(path.join(__dirname, '..', 'tempImages'), { recursive: true })
    const form = formidable({multiples: true, keepExtensions: true, uploadDir : path.join(__dirname, '..', 'tempImages')})

    let oldUser = await userModel.getUserById(req.params.id)

    await form.parse(req, async (err, fields, files) => {
        if (err) {
            return
        }

        let newUser = userModel.modify(fields, req.params.id)

        console.log("user : ", newUser)

        const avatarPicker = files.avatarPicker
        if (avatarPicker) {
            if (avatarPicker.name) {
                await cloudinary.uploader.upload(avatarPicker.path,
                    {
                        folder: 'WebFinalProject/Images/user/'+newUser.user_id,
                        public_id: 'avatar',
                        overwrite: true
                    }, (err, res) => {
                        newUser.avatar = res.secure_url
                    })
            }
            else {
                newUser.avatar = ""
            }
        } else {
            newUser.avatar = oldUser.avatar
        }

        rimraf.sync(path.join(__dirname, '..', 'tempImages'))

        const _ = await userModel.update(newUser)

        const dataContext = {
            isLogin: true,
            userID: newUser.user_id,
            userFullName: newUser.name,
            userAvatar: newUser.avatar,
            email: newUser.email,
            phone: newUser.phone,
            address: newUser.address
        }

        console.log(dataContext)

        res.render('../components/user/views/editProfile', dataContext);
    })
}

exports.chagePassword = (req, res, next) => {
    const dataContext = {
        isLogin: true,
        userFullName: "Nguyen Van A",
    }

    res.render('../components/user/views/changePassword', dataContext);
}