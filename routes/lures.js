const express = require("express");
const router = express.Router();

const { Lure } = require("../models");
const { bootstrapField, createLureForm } = require("../forms");

router.get("/", async (req, res) => {
    const lures = await Lure.collection().fetch();

    res.render("lures/index", {
        "lures": lures.toJSON()
    })
});

router.get("/create", async (req, res) => {
    const lureForm = createLureForm();

    res.render("lures/create", {
        "form": lureForm.toHTML(bootstrapField)
    })
})

router.post("/create", async (req,res) => {
    const lureForm = createLureForm();

    lureForm.handle(req, {
        "success": async (form) => {
            const lure = new Lure(form.data)
            await lure.save();
            res.redirect("/lures")
        }
    })
    
})

module.exports = router;