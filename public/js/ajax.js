function gotoPage(categoryId, page) {
    if (categoryId === 0)
    categoryId = ""

    let hasFilter = false;

    let subcategoryFilter = '';

    let subcategories = document.getElementsByName('subcategories-filter')

    for (let i = 0; i < subcategories.length; i++) {
        if (subcategories[i].checked) {
            subcategoryFilter += '(';
            break;
        }
    }

    for (let i = 0; i < subcategories.length; i++) {
        if (subcategories[i].checked) {
            hasFilter = true;

            subcategoryFilter += 'd.subcategory = ' + (i + 1) + ' OR ';
        }
    }

    if (hasFilter) {
        subcategoryFilter = subcategoryFilter.substr(0, subcategoryFilter.length - 4)
        subcategoryFilter += ')';
    }

    const totalDishPerPageArr = [1, 2, 3, 4]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2, 3, 4]
    const sortBy = totalDishPerPageArr[document.getElementById('sort-by').selectedIndex]

    let url='/dishes?category=' + categoryId + '&subcategory=' + subcategoryFilter +  '&page=' + page + '&total_dish_per_page=' + totalDishPerPage + '&sortBy=' +sortBy;

    let keyName = document.getElementById('key-name').value;
    if (keyName.length > 0) {
        url += '&key_name=' + keyName;
    }

    console.log(url)
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            //render dishes
            let dishesTemplate = Handlebars.compile($('#dishes-template').html());
            let dishes = dishesTemplate({dishes: data.dishes})
            $('#dishes').html(dishes)

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#page-navigation-template").html());
            let pageNavigation = paginationTemplate({category: data.category, page : data.currentPage, totalPage: data.totalPage})
            $('#page-navigation').html(pageNavigation)

            //render total result
            let totalResultTemplate = Handlebars.compile($("#total-result-template").html());
            let totalResult = totalResultTemplate({totalResult: data.totalResult})
            $('#total-result').html(totalResult)
        },
            error: function (err) {
            console.log(err)
        }
    })
}

function changeCart(dish_id, type, sizeDish) {
    let sizes = document.getElementsByName('sizes');

    let size = 0;

    if (sizeDish !== undefined) {
        size = sizeDish
    } else {
        for (let i = 0; i < sizes.length; i++) {
            if (sizes[i].checked) {
                size = i + 1;

                break;
            }
        }

        if (size === 0) {
            size = 1;
        }
    }

    let quantity = document.getElementById('quantity').value;

    const url='/cart/change/' + dish_id + '?type=' + type + '&size=' + size + '&quantity=' + quantity;
    console.log(url)

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)
            let cartItem = {
                itemInCart: data.itemInCart,
                totalCostInCart: data.totalCostInCart,
                totalDishInCart: data.totalDishInCart
            }

            //render mini cart
            let cartTemplate = Handlebars.compile($('#cart-item-template').html());
            let cart = cartTemplate({cart: cartItem})
            $('#cart-item').html(cart)

            //render total dish in cart
            let totalDishInCartTemplate = Handlebars.compile($('#total-dish-in-cart-template').html());
            let totalDishInCart = totalDishInCartTemplate({cart: cartItem})
            $('#total-dish-in-cart').html(totalDishInCart)

            //render mini cost in cart
            let totalCostInCartTemplate = Handlebars.compile($('#total-cost-in-cart-template').html());
            let totalCostInCart = totalCostInCartTemplate({cart: cartItem})
            $('#total-cost-in-cart').html(totalCostInCart)

            //render mini cost in cart 2
            let totalCostInCart2Template = Handlebars.compile($('#total-cost-in-cart-template-2').html());
            let totalCostInCart2 = totalCostInCart2Template({cart: cartItem})
            $('#total-cost-in-cart-2').html(totalCostInCart2)

        },
        error: function (err) {
            console.log(err)
        }
    })
}

function isUserLogin(isLogin) {
    if (!isLogin) {
        alert('Cần đăng nhập để tiếp tục')
    } else {

    }

    return isLogin
}

function checkExistUsername(username) {
    const url='/user/api/is-exist/' + username;
    console.log(url)
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            if (data.isExists == 1) {
                $('#check-exists-username-result').addClass('error-username').removeClass('valid-username')
                $('#check-exists-username-content').html('Username is already exists')

            } else {
                $('#check-exists-username-result').addClass('valid-username').removeClass('error-username')
                $('#check-exists-username-content').html('Username is valid')
            }

            $('#empty').html('<div class="empty-sm-15 empty-xs-15"></div>')
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function validationForm(element, name) {
    let username = document.getElementById('username').value;

    const url='/user/api/is-exist/' + username;
    console.log(url)
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            if (data.isExists == 1) {
                $('#check-exists-username-result').addClass('error-username').removeClass('valid-username')
                $('#check-exists-username-content').html('Username is already exists')

                alert("failed username");
                return false
            } else {
                $('#check-exists-username-result').addClass('valid-username').removeClass('error-username')
                $('#check-exists-username-content').html('Username is valid')

            }

            $('#empty').html('<div class="empty-sm-15 empty-xs-15"></div>')

        },
        error: function (err) {
            console.log(err)
        }
    })

    let password = document.getElementById('password').value;
    let retype = document.getElementById('retype').value;

    console.log(password)

    if (password.length > 0 && password === retype) {
        return true;
    } else {
        alert("failed retype");
        return false;
    }
}

function checkUser() {
    let username = document.getElementById('username-sign-in').value;
    let password = document.getElementById('password-sign-in').value;
    let result = true;

    const url='/user/api/check-user?username=' + username + '&password=' + password;
    console.log(url)
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)

            if (!data) {
                alert('username or password is incorrect')
                return false;
            } else {
                $('#login-form').submit();
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function cancelOrder(order_id, ordinal_number, dish_id) {
    const url = '/order/cancel?order_id='+order_id+'&ordinal_number='+ordinal_number+'&dish='+dish_id;
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)

            let currentOrderTemplate = Handlebars.compile($('#current-order-template').html());
            let currentOrder = currentOrderTemplate({currentOrders: data})
            $('#current-order').html(currentOrder)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function validReview(dish_id) {
    let commentName = document.getElementById('comment-name').value;
    let commentEmail = document.getElementById('comment-email').value;
    let commentMessage = document.getElementById('comment-message').value;

    if (commentName.length === 0 || commentEmail.length === 0 || commentMessage.length === 0) {
        return false;
    }

    const url = '/review?dish_id='+dish_id+'&name='+commentName+'&email='+commentEmail+'&message='+commentMessage;

    console.log(url)
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)

            let reviewTemplate = Handlebars.compile($('#review-template').html());
            let review = reviewTemplate({review: data})
            $('#review').html(review)
        },
        error: function (err) {
            console.log(err)
        }
    })

    document.getElementById('comment-name').value = '';
    document.getElementById('comment-email').value = '';
    document.getElementById('comment-message').value = '';
    return true;
}

function checkVoucher() {
    const code = document.getElementById('voucher-code').value;

    const url = '/voucher/api/v1/isExistsVoucher/' + code;

    console.log(url)
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            if (!data.voucher) {
                alert('voucher does not exists')
            } else {
                let totalCartTemplate = Handlebars.compile($('#cart-total-template').html());
                let totalCart = totalCartTemplate(data)
                $('#cart-total').html(totalCart)
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function checkPassWord(username) {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const retype = document.getElementById('retype-newPassword').value;

    const url='/user/api/check-user?username=' + username + '&password=' + oldPassword;

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            if (!data) {
                alert('password is incorrect')
                return false;
            } else {
                if (newPassword !== retype) {
                    alert('new password and retype must be same')
                    return false;
                } else {
                    if (oldPassword === newPassword) {
                        alert('can not use old password')
                        return false;
                    } else {
                        $('#change-password-form').submit()
                    }
                }
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}