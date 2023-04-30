const express = require("express");
const router = express.Router();

const CartServices = require("../services/cart_services");
const lureDataLayer = require("../dal/lures");

router.get("/", async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    const getCart = await (await cart.getCart()).toJSON()
    console.log(getCart)
    res.render("carts/index", {
        "shoppingCart": getCart
    })
})

router.get("/variant/:variant_id/add", async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.addToCart(req.params.variant_id, 1);
    req.flash("success_messages", "Added to cart");
    res.redirect("/lures")
})

router.get("variant/:variant_id/remove", async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.remove(req.params.variant_id);
    req.flash("success_messages", "Item has been remove");
    res.redirect("/cart")
})

module.exports = router;