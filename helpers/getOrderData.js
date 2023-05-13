const moment = require("moment")
moment().format()

const getOrderData = (userId, stripeSession, paymentIntent) => {
    // convert the created date to datetime format
    const date = moment.unix(stripeSession.created).format("YYYY-MM-DD HH:mm:ss");
    const orderData = {
        "user_id": userId,
        "order_status_id": 2,
        "payment_type": paymentIntent.payment_method_types[0],
        "total_cost": stripeSession.amount_total,
        "order_date": date,
        "shipping_country": stripeSession.shipping_details.address.country,
        "shipping_postal": stripeSession.shipping_details.address.postal_code,
        "shipping_address_line_1": stripeSession.shipping_details.address.line1,
       "shipping_address_line_2": stripeSession.shipping_details.address.line2,
        "billing_country": stripeSession.customer_details.address.country,
        "billing_postal": stripeSession.customer_details.address.postal_code,
        "billing_address_line_1": stripeSession.customer_details.address.line1,
        "billing_address_line_2": stripeSession.customer_details.address.line2,
        "stripe_id": stripeSession.id
    }
    return orderData;
}


module.exports = {
    getOrderData
}