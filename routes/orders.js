const express = require("express");
const router = express.Router();

const { checkIfAdmin, checkIfAuthenticated } = require("../middlewares")

const orderDataLayer = require("../dal/orders");
const { createOrderStatusUpdateForm, bootstrapField } = require("../forms");

router.get("/", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const orders = await orderDataLayer.getAllOrders();
    const orderForm = createOrderStatusUpdateForm();

    res.render("orders/index", {
        orders: orders.toJSON()
    });
})

router.get("/:order_id", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const orders = await orderDataLayer.getOrderItemsByOrderId(req.params.order_id);
    const allOrderStatus = await orderDataLayer.getAllOrderStatus();

    console.log(allOrderStatus.toJSON());

    const orderStatusForm = createOrderStatusUpdateForm();

    res.render("orders/details", {
        orders: orders.toJSON(),
        form: orderStatusForm.toHTML(bootstrapField)
    })
})

router.get("/:")

module.exports = router;
