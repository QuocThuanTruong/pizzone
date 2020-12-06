exports.index = (req, res, next) => {
    const dataContext = {
        isLogin: true,
        userFullName: "Nguyen Van A",
    }

    res.render('../components/user/index', dataContext);
}

exports.edit = (req, res, next) => {
    const dataContext = {
        isLogin: true,
        userFullName: "Nguyen Van A",
    }

    res.render('../components/user/index', dataContext);
}