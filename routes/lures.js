const express = require("express");
const router = express.Router();

const { Lure } = require("../models");

router.get("/", async (req, res) => {
    const lures = await Lure.collection().fetch();

    res.render("lures/index", {
        "lures": lures.toJSON()
    })
});

module.exports = router;