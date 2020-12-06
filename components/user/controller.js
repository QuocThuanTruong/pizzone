exports.index = (req, res, next) => {
    const dataContext = {
        isLogin: true,
        userFullName: "Nguyen Van A",
    }

    res.render('../components/user/views/editProfile', dataContext);
}

exports.edit = (req, res, next) => {
    const dataContext = {
        isLogin: true,
        userFullName: "Nguyen Van A",
    }

    res.render('../components/user/views/editProfile', dataContext);
}

exports.chagePassword = (req, res, next) => {
    const dataContext = {
        isLogin: true,
        userFullName: "Nguyen Van A",
    }

    res.render('../components/user/views/changePassword', dataContext);
}