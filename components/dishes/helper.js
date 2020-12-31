function helper(hbs) {
    hbs.registerHelper('render_pagination', function (category, page, totalPage) {
        let currentPage = parseInt(page)
        let rearLeftPage = currentPage - 2
        let previousPage = currentPage - 1
        let nextPage = currentPage + 1
        let rearRightPage = currentPage + 2
        let lastPage = parseInt(totalPage)

        let html = '';

        html += '<div class="page-navigation"><a class="left-arr" onclick="gotoPage('+category+', 1)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="6px" height="8px" viewBox="0 0 292.359 292.359" style="enable-background:new 0 0 292.359 292.359;" xml:space="preserve"> <g><path d="M222.979,5.424C219.364,1.807,215.08,0,210.132,0c-4.949,0-9.233,1.807-12.848,5.424L69.378,133.331   c-3.615,3.617-5.424,7.898-5.424,12.847c0,4.949,1.809,9.233,5.424,12.847l127.906,127.907c3.614,3.617,7.898,5.428,12.848,5.428   c4.948,0,9.232-1.811,12.847-5.428c3.617-3.614,5.427-7.898,5.427-12.847V18.271C228.405,13.322,226.596,9.042,222.979,5.424z" fill="#898989"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a>'

        if (rearLeftPage > 0) {
            html += '<a onClick="gotoPage('+category+', '+rearLeftPage+')">'+rearLeftPage+'</a>'
            html += '<a onClick="gotoPage('+category+', '+previousPage+')">'+previousPage+'</a>'
        } else if (previousPage > 0) {
            html += '<a onClick="gotoPage('+category+', '+previousPage+')">'+previousPage+'</a>'
        }

        html += '<a style="background-color: darksalmon" onClick="gotoPage('+category+', '+currentPage+')">'+currentPage+'</a>'

        if (rearRightPage <= totalPage) {
            html += '<a onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a>'
            html += '<a onClick="gotoPage('+category+', '+rearRightPage+')">'+rearRightPage+'</a>'
        } else if (nextPage <= totalPage) {
            html += '<a onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a>'
        }

        html += '<a class="right-arr" onclick="gotoPage('+category+', '+lastPage+')"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="6px" height="8px" viewBox="0 0 292.359 292.359" style="enable-background:new 0 0 292.359 292.359;" xml:space="preserve"><g> <path d="M222.979,133.331L95.073,5.424C91.456,1.807,87.178,0,82.226,0c-4.952,0-9.233,1.807-12.85,5.424   c-3.617,3.617-5.424,7.898-5.424,12.847v255.813c0,4.948,1.807,9.232,5.424,12.847c3.621,3.617,7.902,5.428,12.85,5.428   c4.949,0,9.23-1.811,12.847-5.428l127.906-127.907c3.614-3.613,5.428-7.897,5.428-12.847   C228.407,141.229,226.594,136.948,222.979,133.331z" fill="#898989"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a></div>'
        return html
    });

    hbs.registerHelper('render_description', function(description) {
        const MAX_LENGTH = 90;

        if (description.length > MAX_LENGTH) {
            description = description.substring(0, MAX_LENGTH-1)
        }

        description += "..."

        return description;
    });

    hbs.registerHelper('render_igredients', function(igredients) {
        const MAX_LENGTH = 90;

        if (igredients.length > MAX_LENGTH) {
            igredients = igredients.substring(0, MAX_LENGTH-1)
        }

        igredients += "..."

        return igredients;
    });

    hbs.registerHelper('standardPrice', function(quantity, price) {
        price *= quantity

        let priceStr = price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').toString()

        return priceStr.substr(0, priceStr.length - 3) + 'đ'

    })

    hbs.registerHelper('linkAvatar', function(avatar) {
        if (!avatar) {
            avatar = '/img/user_avatar.jpg'
        }

        return avatar
    })
}

module.exports = helper;