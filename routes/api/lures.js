const express = require("express");
const router = express.Router();

const lureDataLayer = require("../../dal/lures");

router.get("/", async (req, res) => {
    res.send(await lureDataLayer.getAllLures());
})




module.exports = router;