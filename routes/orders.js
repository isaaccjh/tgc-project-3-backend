const express = require("express");
const router = express.Router();

const { checkIfAdmin } = require("../middlewares")

const orderDataLayer = require("../dal/orders");

router.get("/", checkIfAdmin, async (req, res) => {
    const orders = await orderDataLayer.getAllOrders();
    res.render("orders/index", {
        orders: orders.toJSON()
    })
})

router.get("/:order_id", checkIfAdmin, async (req, res) => {
    const orders = await orderDataLayer.getOrderItemsByOrderId(req.params.order_id);

    res.render("orders/details", {
        orders: orders.toJSON()
    })
})

module.exports = router;
