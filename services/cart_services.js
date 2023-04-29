const cartDataLayer = require("../dal/cart_items");

class CartServices {
    constructor(user_id) {
        this.user_id = user_id
    }

    async addToCart (variantId, quantity) {
        let cartItem = await cartDataLayer
            .getCartItemByUserAndVariant (this.user_id, variantId);

        if (cartItem) {
            return await cartDataLayer
                .updateQuantity(this.user_id, variantId, cartItem.get("quantity") + 1);
        } else {
            let newCartItem = cartDataLayer
                .createCartItem(this.user_id, variantId, quantity);
            return newCartItem;
        }
    }

    async remove (variantId) {
        return await cartDataLayer
            .removeFromCart(this.user_id, variantId)
    }

    async setQuantity (variantId, quantity) {
        return await cartDataLayer
            .updateQuantity(this.user_id, variantId, quantity)
    }

    async getCart() {
        return await cartDataLayer.getCart(this.user_id)
    }
}

module.exports = CartServices;