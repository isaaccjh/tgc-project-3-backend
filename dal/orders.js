const { Order, OrderStatus } = require("../models");

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

module.exports = {
    getAllOrders,
    addOrder
}