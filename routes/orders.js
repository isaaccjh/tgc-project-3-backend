const express = require("express");
const router = express.Router();

const { Order } = require("../models")

const { checkIfAdmin, checkIfAuthenticated } = require("../middlewares")

const orderDataLayer = require("../dal/orders");
const { createOrderSearchForm, createOrderStatusUpdateForm, bootstrapField } = require("../forms");

router.get("/", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const orders = await orderDataLayer.getAllOrders();
    const allOrderStatus = await orderDataLayer.getAllOrderStatus();
    allOrderStatus.unshift([0, "----"])
    const orderSearchForm = createOrderSearchForm(allOrderStatus);
    let q = Order.collection();

    orderSearchForm.handle(req, {
        "empty": async (form) => {
            let orders = await q.fetch({
                withRelated: ["user", "order_status"]
            });
            res.render("orders/index", {
                orders: orders.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        "error": async (form) => {
            let orders = await q.fetch({
                withRelated: ["user", "order_status"]
            });
            res.render("orders/index", {
                orders: orders.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        "success": async (form) => {
            if (form.data.min_total) {
                q.where("total_cost", ">=", form.data.min_total * 100)
            };
            if (form.data.max_total) {
                q.where("total_cost", "<=", form.data.max_total * 100)
            };
            if (form.data.order_status && form.data.order_status !== 0) {
                q.where("order_status_id", "=", form.data.order_status)
            };
            if (form.data.email) {
                q.query("join", "users", "orders.user_id", "users.id")
                    .where("email", "LIKE", `%${form.data.email}%`)
            }

            let orders = await q.fetch({
                withRelated: ["user", "order_status"]
            });
            res.render("orders/index", {
                orders: orders.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })

    // res.render("orders/index", {
    //     orders: orders.toJSON(),
    //     form: orderSearchForm.toHTML(bootstrapField)
    // });
})

router.get("/:order_id", [checkIfAuthenticated, checkIfAdmin], async (req, res) => {
    const orderItems = await orderDataLayer.getOrderItemsByOrderId(req.params.order_id);
    const allOrderStatus = await orderDataLayer.getAllOrderStatus();

    const order = await orderDataLayer.getOrderByOrderId(req.params.order_id)
    console.log("order is here:", order.toJSON());

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
