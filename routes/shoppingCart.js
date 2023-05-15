const express = require("express");
const router = express.Router();

const { checkIfAuthenticated } = require("../middlewares");

const CartServices = require("../services/cart_services");
const lureDataLayer = require("../dal/lures");

router.get("/", checkIfAuthenticated, async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    const getCart = (await cart.getCart()).toJSON()
    res.render("carts/index", {
        "shoppingCart": getCart
    })
})

router.get("/variant/:variant_id/add", checkIfAuthenticated, async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.addToCart(req.params.variant_id, 1);
    req.flash("success_messages", "Added to cart");
    res.redirect("/lures")
})

router.get("/variant/:variant_id/remove", checkIfAuthenticated, async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.remove(req.params.variant_id);
    req.flash("success_messages", "Item has been removed");
    res.redirect("/cart");
});

router.post("/variant/:variant_id/quantity/update", checkIfAuthenticated, async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.setQuantity(req.params.variant_id, req.body.newQuantity);
    req.flash("success_messages", "Quantity Updated");
    res.redirect("/cart");
})

module.exports = router;