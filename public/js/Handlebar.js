Handlebars.registerHelper('render_description', function(description) {
    const MAX_LENGTH = 90;

    if (description.length > MAX_LENGTH) {
        description = description.substring(0, MAX_LENGTH-1)
    }

    description += "..."

    return description;
});

Handlebars.registerHelper('render_pagination', function (category, page, totalPage) {
    let currentPage = parseInt(page)
    let rearLeftPage = currentPage - 2
    let previousPage = currentPage - 1
    let nextPage = currentPage + 1
    let rearRightPage = currentPage + 2
    let lastPage = parseInt(totalPage)

    let html = '<div class="page-navigation">';

    if (previousPage > 0) {
        html += '<a class="left-arr" onclick="gotoPage('+category+', '+previousPage+')"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="6px" height="8px" viewBox="0 0 292.359 292.359" style="enable-background:new 0 0 292.359 292.359;" xml:space="preserve"> <g><path d="M222.979,5.424C219.364,1.807,215.08,0,210.132,0c-4.949,0-9.233,1.807-12.848,5.424L69.378,133.331   c-3.615,3.617-5.424,7.898-5.424,12.847c0,4.949,1.809,9.233,5.424,12.847l127.906,127.907c3.614,3.617,7.898,5.428,12.848,5.428   c4.948,0,9.232-1.811,12.847-5.428c3.617-3.614,5.427-7.898,5.427-12.847V18.271C228.405,13.322,226.596,9.042,222.979,5.424z" fill="#898989"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a>'
    } else {
        html += '<a class="left-arr"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="6px" height="8px" viewBox="0 0 292.359 292.359" style="enable-background:new 0 0 292.359 292.359;" xml:space="preserve"> <g><path d="M222.979,5.424C219.364,1.807,215.08,0,210.132,0c-4.949,0-9.233,1.807-12.848,5.424L69.378,133.331   c-3.615,3.617-5.424,7.898-5.424,12.847c0,4.949,1.809,9.233,5.424,12.847l127.906,127.907c3.614,3.617,7.898,5.428,12.848,5.428   c4.948,0,9.232-1.811,12.847-5.428c3.617-3.614,5.427-7.898,5.427-12.847V18.271C228.405,13.322,226.596,9.042,222.979,5.424z" fill="#898989"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a>'
    }

    if (currentPage - 1 >= 3) {
        html += '<a onClick="gotoPage('+category+', 1)">1</a>'
        html += '.....'
        html += '<a onClick="gotoPage('+category+', '+previousPage+')">'+previousPage+'</a>'
        html += '<a style="background-color: darksalmon">'+currentPage+'</a>'
    } else if (currentPage === 1){
        html += '<a style="background-color: darksalmon">1</a>'
    } else if (currentPage === 2){
        html += '<a onClick="gotoPage('+category+', 1)">1</a>'
        html += '<a style="background-color: darksalmon">2</a>'
    } else if (currentPage === 3) {
        html += '<a onClick="gotoPage('+category+', 1)">1</a>'
        html += '<a onClick="gotoPage('+category+', 2)">2</a>'
        html += '<a style="background-color: darksalmon">3</a>'
    }

    if (totalPage - currentPage >= 3) {
        html += '<a onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a>'
        html += '.....'
        html += '<a onClick="gotoPage('+category+', '+lastPage+')">'+lastPage+'</a>'
    } else if (totalPage - currentPage === 2){
        html += '<a onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a>'
        html += '<a onClick="gotoPage('+category+', '+lastPage+')">'+lastPage+'</a>'
    } else if (totalPage - currentPage === 1){
        html += '<a onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a>'
    }

    if (nextPage <= lastPage) {
        html += '<a class="right-arr" onclick="gotoPage('+category+', '+nextPage+')"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="6px" height="8px" viewBox="0 0 292.359 292.359" style="enable-background:new 0 0 292.359 292.359;" xml:space="preserve"><g> <path d="M222.979,133.331L95.073,5.424C91.456,1.807,87.178,0,82.226,0c-4.952,0-9.233,1.807-12.85,5.424   c-3.617,3.617-5.424,7.898-5.424,12.847v255.813c0,4.948,1.807,9.232,5.424,12.847c3.621,3.617,7.902,5.428,12.85,5.428   c4.949,0,9.23-1.811,12.847-5.428l127.906-127.907c3.614-3.613,5.428-7.897,5.428-12.847   C228.407,141.229,226.594,136.948,222.979,133.331z" fill="#898989"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a></div>'
    } else {
        html += '<a class="right-arr"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="6px" height="8px" viewBox="0 0 292.359 292.359" style="enable-background:new 0 0 292.359 292.359;" xml:space="preserve"><g> <path d="M222.979,133.331L95.073,5.424C91.456,1.807,87.178,0,82.226,0c-4.952,0-9.233,1.807-12.85,5.424   c-3.617,3.617-5.424,7.898-5.424,12.847v255.813c0,4.948,1.807,9.232,5.424,12.847c3.621,3.617,7.902,5.428,12.85,5.428   c4.949,0,9.23-1.811,12.847-5.428l127.906-127.907c3.614-3.613,5.428-7.897,5.428-12.847   C228.407,141.229,226.594,136.948,222.979,133.331z" fill="#898989"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a></div>'
    }

    return html
});

Handlebars.registerHelper('standardPrice', function(quantity, price) {
    price *= quantity

    let priceStr = price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').toString()

    return priceStr.substr(0, priceStr.length - 3) + 'đ'
})

Handlebars.registerHelper('render_description', function(description) {
    const MAX_LENGTH = 90;

    if (description.length > MAX_LENGTH) {
        description = description.substring(0, MAX_LENGTH-1)
    }

    description += "..."

    return description;
});

Handlebars.registerHelper('render_igredients', function(igredients) {
    const MAX_LENGTH = 80;

    if (igredients.length > 0) {
        const MAX_LENGTH = 90;

        if (igredients.length > MAX_LENGTH) {
            igredients = igredients.substring(0, MAX_LENGTH-1)
        }

        igredients += "..."
    }

    return igredients;

    return igredients;
});

Handlebars.registerPartial('quickView', `<div class="popup index-popup-gallery" data-rel="" id="quick-view-\{{dish_id}}">
    <div class="popup-wrap type-2">
        <div class="empty-sm-0 empty-xs-15"></div>
        <div class="container quick-wrapp">
            <div class="close-popup type-2" onclick="closePopup(\{{dish_id}})">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                     viewBox="0 0 21.9 21.9" enable-background="new 0 0 21.9 21.9" width="14px" height="14px">
                    <path d="M14.1,11.3c-0.2-0.2-0.2-0.5,0-0.7l7.5-7.5c0.2-0.2,0.3-0.5,0.3-0.7s-0.1-0.5-0.3-0.7l-1.4-1.4C20,0.1,19.7,0,19.5,0  c-0.3,0-0.5,0.1-0.7,0.3l-7.5,7.5c-0.2,0.2-0.5,0.2-0.7,0L3.1,0.3C2.9,0.1,2.6,0,2.4,0S1.9,0.1,1.7,0.3L0.3,1.7C0.1,1.9,0,2.2,0,2.4  s0.1,0.5,0.3,0.7l7.5,7.5c0.2,0.2,0.2,0.5,0,0.7l-7.5,7.5C0.1,19,0,19.3,0,19.5s0.1,0.5,0.3,0.7l1.4,1.4c0.2,0.2,0.5,0.3,0.7,0.3  s0.5-0.1,0.7-0.3l7.5-7.5c0.2-0.2,0.5-0.2,0.7,0l7.5,7.5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l1.4-1.4c0.2-0.2,0.3-0.5,0.3-0.7  s-0.1-0.5-0.3-0.7L14.1,11.3z"
                          fill="#484848"/>
                </svg>
            </div>
            <div class="row left-right-item">
                <div class="col-md-6 col-xs-12">
                    <img src="\{{avatar}}" alt="" class="full-img">
                </div>
                <div class="col-md-6 col-xs-12">
                    <div class="quick-content">
                        <div class="empty-sm-0 empty-xs-30"></div>
                        <aside>
                            <div class="empty-sm-20 empty-xs-20"></div>
                            <h4 class="h3 sm tt color-2">\{{name}}</h4>
                            <div class="empty-sm-20 empty-xs-20"></div>
                            \{{#if hasHotDeal}}
                                <h5 class="h5 sm color-2">Giá: <span class="h4 main-col"><b>\{{standardPrice 1 hotDeal.hotDealPrice}}</b></span><span class="h5 line-through simple-text">{{standardPrice 1 price}}</span></h5>
                            \{{else}}
                                <h5 class="h5 sm color-2">Giá: <span class="h4 main-col"><b>\{{standardPrice 1 price}}</b></span></h5>
                            \{{/if}}
                        </aside>
                        <div class="empty-sm-20 empty-xs-20"></div>
                        <aside class="product-size">
                            <h5 class="h5 sm color-2 inline-box">Size:</h5>
                            \{{#each sizes}}
                                <div class="checkbox-entry-wrap">
                                    <label class="checkbox-entry">
                                        <input type="radio" name="sizes-quick-view-\{{dish}}" \{{set-default @index}}>
                                        <span>
                                    <i></i>
                                    <p>\{{name}}</span></p>
                                        </span>
                                    </label>
                                </div>
                            \{{/each}}
                        </aside>


                        <div class="empty-sm-25 empty-xs-20"></div>
                        <aside>
                            <div class="simple-text">
                                <p>\{{detail_description}}</p>
                            </div>
                        </aside>
                        <div class="empty-sm-25 empty-xs-20"></div>
                        <div class="empty-sm-40 empty-xs-25"></div>
                        <aside>
                            <div class="buy-bar type-2">
                                <div class="fl">
                                    <h5 class="h5 sm follow-title quntity">Quantity:</h5>
                                    <div class="custom-input-number type-2">
                                        <button type="button" class="cin-btn cin-decrement">
                                            <img src="/img/left_arr.png" alt="">
                                        </button>
                                        <input type="number" class="cin-input input-field" step="1" value="1" min="1" max="1000" id="quantity">
                                        <button type="button" class="cin-btn cin-increment">
                                            <img src="/img/right_arr.png" alt="">
                                        </button>
                                    </div>
                                    <div class="empty-sm-0 empty-xs-15"></div>
                                </div>
                                <div class="fr">
                                    <a class="page-button button-style-1 type-2" onclick="changeCart(\{{dish_id}}, 1)"><span class="txt">Add to cart</span></a>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
        <div class="empty-sm-0 empty-xs-15"></div>
    </div>
</div>`)

Handlebars.registerHelper('set-default', function(index) {
    if (index === 0) {
        return 'checked'
    } else {
        return ''
    }
})