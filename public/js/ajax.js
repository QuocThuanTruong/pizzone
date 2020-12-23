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

