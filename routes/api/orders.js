const express = require("express");
const router = express.Router();

const orderDataLayer = require("../../dal/orders")

router.get("/:user_id", async (req, res) => {
    try {
        const orders = await orderDataLayer.getOrdersByUserId(req.params.user_id);
        res.status(200).send(orders);
    } catch (e) {
        res.status(404).send("No order found")
    }   
});


module.exports = router;