const express = require("express");
const router = express.Router();

const CartServices = require("../services/cart_services");

router.get("/", async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    res.render("cart/index", {
        "shoppingCart": (await cart.getCart()).toJSON()
    })
})

router.get("/:lure_id/variant/:variant_id", async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.addToCart(req.params.variant_id, 1);
    req.flash("success_messages", "Added to cart");
    res.redirect("/lures")

})