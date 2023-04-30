const express = require("express");
const router = express.Router();

const CartServices = require("../services/cart_services");
const Stripe = require("stripe")("process.env.STRIPE_SECRET_KEY");

router.get("/", async (req, res) => {
    const cart = new CartServices(req.session.user.id);
    let items = await cart.getCart();

    let lineItems = [];
    let meta = [];

    for (let i of items) {
        console.log("i:", i)
        console.log("i.related('lure'):", i.related('lure'))
        console.log("i.related('variant'):", i.related('variant'))
        const lineItem = {
            "quantity": i.get("quantity"),
            "price_data": {
                "currency": "SGD",
                "unit_amount": i.related("variant").get("cost"),
                "product_data": {
                    "name": i.related("lure").get("name")
                }
            }
        }
        if (i.related("variant").get("image_url")) {
            lineItem.price_data.product_data.images = [
                i.related("variant").get("image_url")
            ]
        }
        lineItems.push(lineItem);
        meta.push({
            "variant_id": i.get("variant_id"),
            "quantity": i.get("quantity")
        })
    }

    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ["card", "paynow", "grabpay"],
        mode: "payment",
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_SUCCESS_URL,
        metadata: {
            "orders": metaData
        }
    }

    let stripeSession = await Stripe.checkout.sessions.create(payment);
    res.render("checkout/checkout", {
        "sessionId": stripeSession.id,
        "publishableKey": process.env.STRIPE_PUBLISHABLE_KEY
    })

    
})

module.exports = router;
