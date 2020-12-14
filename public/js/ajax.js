
    function gotoPage(categoryId, page) {
    if (categoryId === 0)
    categoryId = ""

    const totalDishPerPageArr = [1, 2, 3, 4]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const url='/dishes?category='+categoryId+'&page='+page+'&total_dish_per_page='+totalDishPerPage;

    $.ajax({
    url: url,
    type: "GET",
    success: function (data) {
    let html = ""

    data.dishes.forEach( (val, index) => {
    html += '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">';
    html += '<div class="empty-sm-50 empty-xs-30"></div>';
    html += '<div class="menu-item menu-item-2 type-3">';
    html += '<div class="image hover-zoom">';
    html += '<a href="#" class="like-product main-fill-col">';
    html += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 471.701 471.701" style="enable-background:new 0 0 471.701 471.701;" xml:space="preserve" width="16px" height="16px"><g><path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3C444.801,187.101,434.001,213.101,414.401,232.701z"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a>';
    html += '<img src="' + val.avatar + '"alt="">';
    html += '<div class="vertical-align full menu-button">';
    html += ' <a href="#" class="page-button button-style-1 type-4"><span class="txt">Add to cart</span></a>';
    html += '<div class="empty-sm-10 empty-xs-10"></div>';
    html += '<a href="#" class="page-button button-style-1 type-2 open-popup" data-open="popup-gallery" data-rel="1"><span class="txt">quick view</span></a>';
    html += '</div></div>';
    html += ' <div class="text">';
    html += '<div class="empty-sm-15 empty-xs-10"></div>';
    html += '<h5 class="h5 caption"><a href="/dishes/'+val.dish_id+'" class="link-hover-line">'+val.name+'</a></h5>';
    html += '<div class="empty-sm-5 empty-xs-5"></div>';
    html += '<div class="empty-sm-10 empty-xs-10"></div>';
    html += '<div class="menu-price style-2 title main-col">'+val.price+'VNĐ</div>';
    html += '</div> </div></div>';
})

    console.log(data)

    $('#pagination').html(html)

    let currentPage = parseInt(data.currentPage)
    let rearLeftPage = currentPage - 2
    let previousPage = currentPage - 1
    let nextPage = currentPage + 1
    let rearRightPage = currentPage + 2
    let lastPage = parseInt(data.totalPage)

    html = '';

    html += '<a class="left-arr" onclick="gotoPage('+data.category+', 1)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="6px" height="8px" viewBox="0 0 292.359 292.359" style="enable-background:new 0 0 292.359 292.359;" xml:space="preserve"> <g><path d="M222.979,5.424C219.364,1.807,215.08,0,210.132,0c-4.949,0-9.233,1.807-12.848,5.424L69.378,133.331   c-3.615,3.617-5.424,7.898-5.424,12.847c0,4.949,1.809,9.233,5.424,12.847l127.906,127.907c3.614,3.617,7.898,5.428,12.848,5.428   c4.948,0,9.232-1.811,12.847-5.428c3.617-3.614,5.427-7.898,5.427-12.847V18.271C228.405,13.322,226.596,9.042,222.979,5.424z" fill="#898989"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a>'

    if (rearLeftPage > 0) {
    html += '<a onClick="gotoPage('+data.category+', '+rearLeftPage+')">'+rearLeftPage+'</a>'
    html += '<a onClick="gotoPage('+data.category+', '+previousPage+')">'+previousPage+'</a>'
} else if (previousPage > 0) {
    html += '<a onClick="gotoPage('+data.category+', '+previousPage+')">'+previousPage+'</a>'
}

    html += '<a style="background-color: darksalmon" onClick="gotoPage('+data.category+', '+currentPage+')">'+currentPage+'</a>'

    if (rearRightPage <= data.totalPage) {
    html += '<a onClick="gotoPage('+data.category+', '+nextPage+')">'+nextPage+'</a>'
    html += '<a onClick="gotoPage('+data.category+', '+rearRightPage+')">'+rearRightPage+'</a>'
} else if (nextPage <= data.totalPage) {
    html += '<a onClick="gotoPage('+data.category+', '+nextPage+')">'+nextPage+'</a>'
}

    html += '<a class="right-arr" onclick="gotoPage('+data.category+', '+lastPage+')"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="6px" height="8px" viewBox="0 0 292.359 292.359" style="enable-background:new 0 0 292.359 292.359;" xml:space="preserve"><g> <path d="M222.979,133.331L95.073,5.424C91.456,1.807,87.178,0,82.226,0c-4.952,0-9.233,1.807-12.85,5.424   c-3.617,3.617-5.424,7.898-5.424,12.847v255.813c0,4.948,1.807,9.232,5.424,12.847c3.621,3.617,7.902,5.428,12.85,5.428   c4.949,0,9.23-1.811,12.847-5.428l127.906-127.907c3.614-3.613,5.428-7.897,5.428-12.847   C228.407,141.229,226.594,136.948,222.979,133.331z" fill="#898989"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a>'
    $("#page-navigation").html(html)

    console.log(html)
},
    error: function (err) {
    conole.log(err)
}
})

    /*      $.get(url, () => {

          })*/

    /*window.location.replace(url)*/
}
