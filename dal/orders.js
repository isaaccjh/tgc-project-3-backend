const { Order, OrderStatus } = require("../models");

const getAllOrders = async () => {
    const orders = await Order.collection().fetch({
        require: false,
        withRelated: []
    })
    return orders;
}

addOrder = async ()

module.exports = {
    getAllOrders
}