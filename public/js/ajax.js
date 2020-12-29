function gotoPage(categoryId, page) {
    if (categoryId === 0)
    categoryId = ""

    let hasFilter = false;

    let subcategoryFilter = '';
    let toppingFilter = '';
    let sizeFilter = '';
    let doughFilter = '';

    if (categoryId === 1) {
        //subcategory
        if (document.getElementById("traditional").checked) {
            hasFilter = true;

            subcategoryFilter += '(d.subcategory = 1';
        }

        if (document.getElementById("seaFood").checked) {
            hasFilter = true;

            if (subcategoryFilter.length > 0) {
                subcategoryFilter += ' or d.subcategory = 3';
            } else {
                subcategoryFilter += '(d.subcategory = 3'
            }
        }

        if (document.getElementById("mixed").checked) {
            hasFilter = true;

            if (subcategoryFilter.length > 0) {
                subcategoryFilter += ' or d.subcategory = 2';
            } else {
                subcategoryFilter += '(d.subcategory = 2'
            }
        }

        if (hasFilter) {
            subcategoryFilter += ')';

            hasFilter = false;
        }

        //topping
        if (document.getElementById("bellPepper").checked) {
            hasFilter = true;

            toppingFilter += '(dt.name LIKE \'%Ot chuong%\'';
        }

        if (document.getElementById("mushroom").checked) {
            hasFilter = true;

            if (toppingFilter.length > 0) {
                toppingFilter += ' or dt.name LIKE \'%Nam%\'';
            } else {
                toppingFilter += '(dt.name LIKE \'%Nam%\''
            }
        }

        if (document.getElementById("salad").checked) {
            hasFilter = true;

            if (toppingFilter.length > 0) {
                toppingFilter += ' or dt.name LIKE \'%Cai xa lach%\'';
            } else {
                toppingFilter += '(dt.name LIKE \'%Cai xa lach%\'';
            }
        }

        if (document.getElementById("smokedPork").checked) {
            hasFilter = true;

            if (toppingFilter.length > 0) {
                toppingFilter += ' or dt.name LIKE \'%Thit xong khoi%\'';
            } else {
                toppingFilter += '(dt.name LIKE \'%Thit xong khoi%\'';
            }
        }

        if (hasFilter) {
            toppingFilter += ')';

            hasFilter = false;
        }

        //Size
        if (document.getElementById("pizzaSize1").checked) {
            hasFilter = true;

            sizeFilter += '(ds.name LIKE \'%25cm (250g)%\'';
        }

        if (document.getElementById("pizzaSize2").checked) {
            hasFilter = true;

            if (sizeFilter.length > 0) {
                sizeFilter += ' or ds.name LIKE \'%30cm (450g)%\'';
            } else {
                sizeFilter += '(ds.name LIKE \'%30cm (450g)%\''
            }
        }

        if (document.getElementById("pizzaSize3").checked) {
            hasFilter = true;

            if (sizeFilter.length > 0) {
                sizeFilter += ' or ds.name LIKE \'%40cm (550g)%\'';
            } else {
                sizeFilter += '(ds.name LIKE \'%40cm (550g)%\'';
            }
        }

        if (hasFilter) {
            sizeFilter += ')';

            hasFilter = false;
        }

        //Dough
        if (document.getElementById("dough1").checked) {
            hasFilter = true;

            doughFilter += '(dd.name LIKE \'%Mong%\'';
        }

        if (document.getElementById("dough2").checked) {
            hasFilter = true;

            if (doughFilter.length > 0) {
                doughFilter += ' or dd.name LIKE \'%Dày%\'';
            } else {
                doughFilter += '(dd.name LIKE \'%Day%\''
            }
        }

        if (hasFilter) {
            doughFilter += ')';

            hasFilter = false;
        }
    } else if (categoryId === 2) {
        //Size
        if (document.getElementById("drinkSize1").checked) {
            hasFilter = true;

            sizeFilter += '(ds.name LIKE \'%L%\'';
        }

        if (document.getElementById("drinkSize2").checked) {
            hasFilter = true;

            if (sizeFilter.length > 0) {
                sizeFilter += ' or ds.name LIKE \'%M%\'';
            } else {
                sizeFilter += '(ds.name LIKE \'%M%\''
            }
        }

        if (hasFilter) {
            sizeFilter += ')';

            hasFilter = false;
        }
    }
    else if (categoryId === 3) {
        //Size
        if (document.getElementById("sideSize1").checked) {
            hasFilter = true;

            sizeFilter += '(ds.name LIKE \'%1 Nguoi An%\'';
        }

        if (document.getElementById("sideSize2").checked) {
            hasFilter = true;

            if (sizeFilter.length > 0) {
                sizeFilter += ' or ds.name LIKE \'%2 Nguoi An%\'';
            } else {
                sizeFilter += '(ds.name LIKE \'%2 Nguoi An%\''
            }
        }

        if (hasFilter) {
            sizeFilter += ')';

            hasFilter = false;
        }
    }

    const totalDishPerPageArr = [1, 2, 3, 4]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2, 3, 4]
    const sortBy = totalDishPerPageArr[document.getElementById('sort-by').selectedIndex]

    const url='/dishes?category=' + categoryId + '&subcategory=' + subcategoryFilter + '&size=' + sizeFilter + '&topping=' + toppingFilter + '&dough=' + doughFilter + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage + '&sortBy=' +sortBy;
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

    /*      $.get(url, () => {

          })*/

    /*window.location.replace(url)*/
}

function changeCart(dish_id, type) {
    const url='cart/change/' + dish_id + '?type=' + type;
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
    const url='user/api/is-exist/' + username;
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

    const url='user/api/is-exist/' + username;
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

    const url='user/api/check-user?username=' + username + '&password=' + password;
    console.log(url)
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)

            if (!data) {
                result = false;
                alert('username or password is incorrect')
            }
        },
        error: function (err) {
            console.log(err)
        }
    })

    return result;
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