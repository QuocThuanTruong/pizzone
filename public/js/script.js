function openPopup() {
    $('#quick-view').addClass('active')
}

function closePopup() {
    $('#quick-view').removeClass('active')
}

function decrementQuantity() {
    let quantity = parseInt($('#quantity').value)

    if (quantity > 1) {
        quantity--
    }

    $('#quantity').value = quantity.toString()
}

function incrementQuantity() {
    let quantity = parseInt($('#quantity').value)

    if (quantity < 1000) {
        quantity++
    }

    $('#quantity').value = quantity.toString()
}