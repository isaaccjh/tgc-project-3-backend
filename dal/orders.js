const { Order, OrderItem } = require("../models");

const getAllOrders = async () => {
    const orders = await Order.collection().fetch({
        require: false,
        withRelated: ["user", "order_status"]
    })
    return orders;
}

const addOrder = async (orderInfo) => {
    const order = new Order(orderInfo);
    await order.save();
    return order;
}

const addOrderItem = async (orderId, variantId, quantity) => {
    const item = new OrderItem({
        "quantity": quantity,
        "variant_id": variantId,
        "order_id": orderId
    })
    await item.save();
    return item;
}

const findOrderByStripeId = async (stripeId) => {
    const order = await Order.where({
        "stripe_id": stripeId
    }).fetch({
        require: true
    });

    return order;
}

const getOrderItemsByOrderId = async (orderId) => {
    const orderItems = await OrderItem.collection().where({
        "order_id": orderId
    }).fetch({
        require: false,
        withRelated: ["variant"]
    })
    return orderItems;
}



module.exports = {
    getAllOrders,
    addOrder,
    addOrderItem,
    findOrderByStripeId,
    getOrderItemsByOrderId
}