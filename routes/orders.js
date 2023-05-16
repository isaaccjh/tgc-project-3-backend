const express = require("express");
const router = express.Router();

const { checkIfAdmin, checkIfAuthenticated } = require("../middlewares")
const { Order } = require("../models")
const orderDataLayer = require("../dal/orders");
const { createOrderSearchForm, createOrderStatusUpdateForm, bootstrapField } = require("../forms");

router.get("/", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const orders = orderDataLayer.getAllOrders();


    const allOrderStatus = await orderDataLayer.getAllOrderStatus();
    allOrderStatus.unshift([0, "----"]);

    const orderSearchForm = createOrderSearchForm(allOrderStatus);
    const q = Order.collection();

    orderSearchForm.handle(req, {
        "success": async (form) => {
            const orders = orderDataLayer.searchOrders(form.data);

            res.render("orders/index", {
                orders: orders.toJSON(),
                form: orderSearchForm.toHTML(bootstrapField)
            });
        },
        "empty": () => {
            const orders = orderDataLayer.searchOrders(form.data);
            res.render("orders/index", {
                orders: orders.toJSON(),
                form: orderSearchForm.toHTML(bootstrapField)
            })
        },
        "error": () => {
            const orders = orderDataLayer.searchOrders(form.data);
            res.render("orders/index", {
                orders: orders.toJSON(),
                form: orderSearchForm.toHTML(bootstrapField)
            })
        }
    })

    res.render("orders/index", {
        orders: orders.toJSON(),
        form: orderSearchForm.toHTML(bootstrapField)
    });

});

router.get("/:order_id", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const orderItems = await orderDataLayer.getOrderItemsByOrderId(req.params.order_id);
    const allOrderStatus = await orderDataLayer.getAllOrderStatus();

    const order = await orderDataLayer.getOrderByOrderId(req.params.order_id)


    const orderStatusForm = createOrderStatusUpdateForm(allOrderStatus);
    orderStatusForm.fields.order_status_id.value = order.get("order_status_id");


    res.render("orders/details", {
        orderItems: orderItems.toJSON(),
        order: order.toJSON(),
        form: orderStatusForm.toHTML(bootstrapField)
    })
})

router.post("/:order_id", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const order = await orderDataLayer.getOrderByOrderId(req.params.order_id);
    const allOrderStatus = await orderDataLayer.getAllOrderStatus();
    const orderItems = await orderDataLayer.getOrderItemsByOrderId(req.params.order_id);

    const orderStatusForm = createOrderStatusUpdateForm(allOrderStatus);
    orderStatusForm.handle(req, {
        "success": async (form) => {
            order.set(form.data);
            await order.save();
            req.flash("success_messages", "Order Status has been updated")
            res.redirect("/orders")
        },
        "error": (form) => {
            res.render("orders/details", {
                "form": form.toHTML(bootstrapField),
                "order": order.toJSON(),
                "orderItems": orderItems.toJSON()
            })
        },
        "empty": (form) => {
            res.render("orders/details", {
                "form": form.toHTML(bootstrapField),
                "order": order.toJSON(),
                "orderItems": orderItems.toJSON()
            })
        }
    })
})

module.exports = router;
