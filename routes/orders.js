const express = require("express");
const router = express.Router();

const orderDataLayer = require("../dal/orders")

router.get("/", async (req, res) => {
    const orders = await orderDataLayer.getAllOrders();
    console.log(orders.toJSON())
})

module.exports = router;
