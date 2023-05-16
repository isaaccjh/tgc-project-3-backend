const { Order, OrderItem, OrderStatus } = require("../models");

const getAllOrders = async () => {
    const orders = await Order.collection().fetch({
        require: false,
        withRelated: ["user", "order_status"]
    })
    return orders;
}

const searchOrders = async (formData) => {
    const q = Order.collection();


    
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
        withRelated: ["variant", "variant.colour", "variant.lure", "variant.property"]
    })
    return orderItems;
}

const getOrdersByUserId = async (userId) => {
    const orders = await Order.collection().where({
        "user_id": userId
    }).fetch({
        require: false,
        withRelated: ["order_status"]
    });
    return orders;
}

const getAllOrderStatus = async () => {
    const orderStatus = await OrderStatus.fetchAll().map(status => [status.get("id"), status.get("order_status")])
    return orderStatus;
}

const getOrderByOrderId = async (orderId) => {
    const order = await Order.where({
        "id": orderId
    }).fetch({
        require: false
    });
    return order;
}





module.exports = {
    getAllOrders,
    addOrder,
    addOrderItem,
    findOrderByStripeId,
    getOrderItemsByOrderId,
    getOrdersByUserId,
    getAllOrderStatus,
    getOrderByOrderId
}