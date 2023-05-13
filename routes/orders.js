const express = require("express");
const router = express.Router();

const orderDataLayer = require("../dal/orders");

router.get("/", async (req, res) => {
    const orders = await orderDataLayer.getAllOrders();
    res.render("orders/index", {
        orders: orders.toJSON()
    })
})

router.get("/:order_id", async (req, res) => {
    const orders = await orderDataLayer.getOrderItemsByOrderId(req.params.order_id);
    console.log("colours:", orders.toJSON().colour);
    console.log("property:", orders.toJSON().property);
    console.log("lure:", orders.toJSON().lure);
    res.render("orders/details", {
        orders: orders.toJSON()
    })
})

module.exports = router;
