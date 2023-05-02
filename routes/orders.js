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

router.get("/:order_id", async (req, res) => {
    const orders = await orderDataLayer.getOrderItemsByOrderId(req.params.order_id);
    console.log(orders.toJSON());
    res.render("orders/details", {
        orders: orders.toJSON
    })
})

module.exports = router;
