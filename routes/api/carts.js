const express = require("express");
const router = express.Router();

const cartDataLayer = require("../../dal/cart_items");

router.get("/:user_id", async (req, res) => {
    const cart = await cartDataLayer.getCart(req.params.user_id);
    res.send(cart);
})

module.exports = router;