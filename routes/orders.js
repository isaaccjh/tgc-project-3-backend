const express = require("express");
const router = express.Router();

const orderDataLayer = require("../dal/orders");

router.get("/", async (req, res) => {
    const orders = await orderDataLayer.getAllOrders();
    console.log(orders.toJSON());
    res.render("orders/index", {
        orders: orders.toJSON()
    })
})

module.exports = router;
