const cartDataLayer = require("../dal/cart_items");

class CartServices {
    constructor(user_id) {
        this.user_id = user_id
    }

    async addToCart(variantId, quantity) {
        let cartItem = await cartDataLayer.getCartItemByUserAndVariant (this.user_id, variantId)
    }
}

module.exports = CartServices;