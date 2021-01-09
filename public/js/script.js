function openPopup() {
    $('#quick-view').addClass('active')
}

function closePopup() {
    $('#quick-view').removeClass('active')
}

function getPriceFilter() {
    console.log(document.getElementById('min-price').value)
}