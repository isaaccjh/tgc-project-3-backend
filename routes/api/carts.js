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

router.post("/:variant_id/update", checkIfAuthenticatedJWT, async (req, res) => {
    try {
        const cart = await cartDataLayer.updateQuantity(req.body.userId, req.params.variant_id, req.body.quantity);
        res.status(200).send("Updated", cart)
    } catch (e) {
        res.sendStatus(404);
    }
    
})

module.exports = router;