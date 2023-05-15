const express = require("express");
const router = express.Router();

const { checkIfAdmin, checkIfAuthenticated } = require("../middlewares")

const orderDataLayer = require("../dal/orders");
const { createOrderStatusUpdateForm } = require("../forms");

router.get("/", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const orders = await orderDataLayer.getAllOrders();
    const orderForm = createOrderStatusUpdateForm();

    res.render("orders/index", {
        orders: orders.toJSON()
    });
})

router.get("/:order_id", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const orders = await orderDataLayer.getOrderItemsByOrderId(req.params.order_id);

    res.render("orders/details", {
        orders: orders.toJSON()
    })
})

router.get("/:")

module.exports = router;
