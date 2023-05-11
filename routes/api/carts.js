const express = require("express");
const router = express.Router();

const cartDataLayer = require("../../dal/cart_items");
const { checkIfAuthenticatedJWT } = require("../../middlewares")

router.get("/:user_id", checkIfAuthenticatedJWT, async (req, res) => {
    try {
        const cart = await cartDataLayer.getCart(req.params.user_id);
        res.status(200).send(cart);
    } catch (e) {
        res.sendStatus(404);
    }
})

router.post("/add", async (req, res) => {
    try {
        const { userId, variantId, quantity } = req.body
        let cart;
        let cartItem = await cartDataLayer.getCartItemByUserAndVariant(userId, variantId);
        if (cartItem) {
            cart = await cartDataLayer.updateQuantity(userId, variantId, cartItem.get("quantity") + quantity);
        } else {
            cart = await cartDataLayer.createCartItem(userId, variantId, quantity);

        }
        res.status(200).send(cart);
    } catch (e) {
        res.sendStatus(404);
    }
})

router.post("/update", async (req, res) => {
    try {
        const cart = await cartDataLayer.updateQuantity(req.body.userId, req.body.variantId, req.body.quantity);
        res.status(200).send(cart)
    } catch (e) {
        res.status(404).send("Failed to update, please try again later.");
    }
})


router.post("/delete", async (req, res) => {
    try {
        const cart = await cartDataLayer.removeFromCart(req.body.userId, req.body.variantId);
        res.status(200).send("Successfully removed from cart!")
    } catch (e) {
        res.status(404).send("Failed to delete, please try again later.")
    }
})

module.exports = router;