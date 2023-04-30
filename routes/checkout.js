const express = require("express");
const router = express.Router();

const CartServices = require("../services/cart_services");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const orderDataLayer = require("../dal/orders");

router.get("/", async (req, res) => {
    const cart = new CartServices(req.session.user.id);
    let items = await cart.getCart();

    let lineItems = [];
    let meta = [];

    for (let i of items) {
        const lineItem = {
            "quantity": i.get("quantity"),
            "price_data": {
                "currency": "sgd",
                "unit_amount": i.related("variant").get("cost"),
                "product_data": {
                    "name": i.related("variant").toJSON().lure.name
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
        },
        shipping_address_collection: {
            allowed_countries: ["SG"]
        },
        billing_address_collection: "required",
        invoice_creation: {
            enabled: true
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Standard",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: 300,
                        currency: "sgd"
                    },
                    delivery_estimate: {
                        minimum: {
                            unit: "business_day",
                            value: 4
                        },
                        maximum: {
                            unit: "business_day",
                            value: 7
                        }
                    }
                }
            },
            {
                shipping_rate_data: {
                    display_name: "Express",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: 500,
                        currency: "sgd"
                    },
                    delivery_estimate: {
                        minimum: {
                            unit: "business_day",
                            value: 1
                        },
                        maximum: {
                            unit: "business_day",
                            value: 3
                        }
                    }
                }
            }
        ]
    }

    let stripeSession = await Stripe.checkout.sessions.create(payment);
    res.render("checkout/checkout", {
        "sessionId": stripeSession.id,
        "publishableKey": process.env.STRIPE_PUBLISHABLE_KEY
    })

})

router.post("/process_payment", express.raw({ type: "application/json" }),
    async (req, res) => {
        let payload = req.body;
        let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
        let sigHeader = req.headers["stripe-signature"];
        let event;
        try {
            event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
        } catch (e) {
            res.send({
                "error": e.message
            })
            console.log(e.message)
        }
        if (event.type == "checkout.session.completed") {
            let stripeSession = event.data.object;

            const paymentIntent = await Stripe.paymentIntents.retrieve(stripeSession.payment_intent);

            console.log(paymentIntent);
            console.log("User ID =>", req.session.user.id);
            console.log("Order Status ID =>", "Order Status ID: 2 ");
            console.log("Payment Type =>", paymentIntent.payment_method_types[0]);
            console.log("Billing Address =>", stripeSession.customer_details);
            console.log("Shipping Address =>", stripeSession.shipping_details);
            console.log("Total Cost =>", stripeSession.amount_total);
            console.log("Order Date =>", stripeSession.created);

            // let orderData be an object that can create new Order,
            // need to extract all data from payment intent
            // const orderData = {

            // }
        }
        res.send({ received: true });

    }
)

module.exports = router;
