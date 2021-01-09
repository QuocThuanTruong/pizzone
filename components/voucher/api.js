const voucherModel = require('./model')
const cartModel = require('../cart/model')

exports.isExistsVoucher = async (req, res, next) => {
    let code = req.params.code;

    let voucher = await voucherModel.isExistsVoucher(code);

    let totalCostInCart = req.user.cart.totalCostInCart;
    let shippingFee = await cartModel.getShippingFee(totalCostInCart)
    let voucherCost = 0;

    if (voucher) {
        voucherCost = Math.ceil(totalCostInCart / 100 * voucher.discount / 1000) * 1000
    }

    let totalCost = totalCostInCart - voucherCost + shippingFee;

    let data = {
        voucher : voucher,
        totalCostInCart : totalCostInCart,
        shippingFee : shippingFee,
        voucherCost : voucherCost,
        totalCost : totalCost
    }

    global.totalCost = totalCost;

    res.send(data);
}