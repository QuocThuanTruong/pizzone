function openPopup(dish) {
    let id = '#quick-view-' + dish;
    $(id).addClass('active')
}

function closePopup(dish) {
    let id = '#quick-view-' + dish;
    $(id).removeClass('active')
}

function getPriceFilter() {
    console.log('cc')
}

function submitSearchFromHomepage() {
    let inputSearch = document.getElementById('input-search').value;

    window.location.replace('/dishes?name=' + inputSearch);
}