const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("products/lures/index");
})


module.exports = router;