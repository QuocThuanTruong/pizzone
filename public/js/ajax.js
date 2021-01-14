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

    const totalDishPerPageArr = [3, 6, 9, 12]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2, 3, 4]
    const sortBy = totalDishPerPageArr[document.getElementById('sort-by').selectedIndex]
    let minPrice = parseInt(document.getElementById('min-price').value);
    let maxPrice = parseInt(document.getElementById('max-price').value);

    let url='/dishes?category=' + categoryId + '&subcategory=' + subcategoryFilter + '&min=' + minPrice + '&max=' + maxPrice + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage + '&sortBy=' +sortBy;

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
            let dishesTemplate = Handlebars.compile($('#dishes-template-grid').html());
            let dishes = dishesTemplate({dishes: data.dishes});
            $('#dishes-grid').html(dishes);

            let dishesTemplate2 = Handlebars.compile($('#dishes-template-list').html());
            let dishes2 = dishesTemplate2({dishes: data.dishes});
            $('#dishes-list').html(dishes2);

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#page-navigation-template").html());
            let pageNavigation = paginationTemplate({category: data.category, page : data.currentPage, totalPage: data.totalPage});
            $('#page-navigation').html(pageNavigation);

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


function gotoReview(dish, page) {
    if (dish === 0) {
        dish = ""
    }

    let url='/review/paging/' + dish + '?page=' + page;

    console.log(url)

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            //render review
            let reviewsTemplate = Handlebars.compile($('#review-template').html());
            let reviews = reviewsTemplate({review: data.review});
            $('#review').html(reviews);

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#page-navigation-template").html());
            let pageNavigation = paginationTemplate({id: data.review[0].dish, page: data.currentPage, totalPage: data.totalPage});
            $('#page-navigation').html(pageNavigation);

        },
        error: function (err) {
            console.log(err)
        }
    })
}


function changeCart(dish_id, type, sizeDish) {
    let sizes = document.getElementsByName('sizes');

    if (sizes.length === 0) {
        sizes = document.getElementsByName('sizes-' + dish_id)
    }

    if (sizes.length === 0) {
        sizes = document.getElementsByName('sizes-quick-view-' + dish_id)
    }

    let size = 0;

    if (sizeDish !== undefined) {
        size = sizeDish
    } else {
        for (let i = 0; i < sizes.length; i++) {
            console.log(sizes[i])
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

            let cartIndexTemplate = Handlebars.compile($('#cart-item-index-template').html());
            let cartIndex = cartIndexTemplate({cart: cartItem})
            $('#cart-item-index').html(cartIndex)

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

            let totalCostTemplate = Handlebars.compile($('#total-cost-template').html());
            let totalCost = totalCostTemplate({cart: cartItem})
            $('#total-cost').html(totalCost)

        },
        error: function (err) {
            console.log(err)
        }
    })
}

function changeCartQuickView(dish_id, type, sizeDish) {
    let sizes = document.getElementsByName('sizes-quick-view-' + dish_id);

    let size = 0;

    if (sizeDish !== undefined) {
        size = sizeDish
    } else {
        for (let i = 0; i < sizes.length; i++) {
            console.log(sizes[i])
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
        $('#login-alert-popup').addClass('active');

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
                $('#empty-user-error').html('<div class="empty-sm-15 empty-xs-15"></div>')
                $('#check-exists-username-result').addClass('error-username').removeClass('valid-username')
                $('#check-exists-username-content').html('Username is already exists')

            } else {
                $('#empty-user-error').html('<div class="empty-sm-15 empty-xs-15"></div>')
                $('#check-exists-username-result').addClass('valid-username').removeClass('error-username')
                $('#check-exists-username-content').html('Username is valid')
            }
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
                $('#empty-user-error').html('<div class="empty-sm-15 empty-xs-15"></div>')
                $('#check-exists-username-result').addClass('error-username').removeClass('valid-username')
                $('#check-exists-username-content').html('Username is already exists')

                return false
            } else {
                $('#empty-user-error').html('<div class="empty-sm-15 empty-xs-15"></div>')
                $('#check-exists-username-result').addClass('valid-username').removeClass('error-username')
                $('#check-exists-username-content').html('Username is valid')

            }

        },
        error: function (err) {
            console.log(err)
        }
    })

    let password = document.getElementById('password').value;
    let retype = document.getElementById('retype').value;

    if (password.length > 0 && password === retype) {
        $('#register-error-text').html('');
        $('#empty-error').html('<div class="empty-0"></div>')
    } else {
        $('#register-error-text').html('Retyped-password is not correct');
        $('#empty-error').html('<div class="empty-sm-15 empty-xs-15"></div>')
        return false;
    }

    if (!document.getElementById('agree').checked) {
        alert('Đồng ý với điều khoản')
        return false;
    } else {
        return true;
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
            if (!data) {
                if (username !== '' && password !== '') {
                    document.getElementById('login-error-text').innerHTML = 'Username or password is not correct'

                } else if (username === '') {
                    if (password === '') {
                        $('#login-error-text').html('Username and password must not be empty');
                    } else {
                        $('#login-error-text').html('Username must not be empty');
                    }
                } else if (password === '') {
                    $('#login-error-text').html('Password must not be empty');
                }
                $('#empty').html('<div class="empty-sm-15 empty-xs-15"></div>')

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

function cancelOrder(order_id) {
    const url = '/order/cancel?order_id='+order_id;
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)

            let currentOrderTemplate = Handlebars.compile($('#current-orders-template').html());
            let currentOrder = currentOrderTemplate({currentOrders: data})
            $('#current-orders').html(currentOrder)
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
                $('#check-voucher-result').addClass('error-username').removeClass('valid-username')
                $('#check-voucher-content').html('Voucher does not exists')
                $('#empty').html('<div class="empty-sm-15 empty-xs-15"></div>')
            } else {
                $('#check-voucher-result').addClass('valid-username').removeClass('error-username')
                $('#check-voucher-content').html('Voucher is valid')
                $('#empty').html('<div class="empty-sm-15 empty-xs-15"></div>')

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
                $('#check-password-result').addClass('error-username').removeClass('valid-username')
                $('#check-password-result').html('Current password is not correct')
                $('#empty-password').html('<div class="empty-sm-15 empty-xs-15"></div>')
                return false;
            } else {
                if (newPassword !== retype) {
                    $('#check-password-result').addClass('error-username').removeClass('valid-username')
                    $('#check-password-result').html('Retyped password is not correct')
                    $('#empty-password').html('<div class="empty-sm-15 empty-xs-15"></div>')
                    return false;
                } else {
                    if (oldPassword === newPassword) {
                        $('#check-password-result').addClass('error-username').removeClass('valid-username')
                        $('#check-password-result').html('Your new password is duplicate your old one.')
                        $('#empty-password').html('<div class="empty-sm-15 empty-xs-15"></div>')
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