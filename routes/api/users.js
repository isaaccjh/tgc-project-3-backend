const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { User } = require("../../models")
const { checkIfAuthenticatedJWT } = require("../../middlewares")

const generateAccessToken = (user) => {
    return jwt.sign({
        "username": user.get("username"),
        "id": user.get("id"),
        "email": user.get("email")
    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    });
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("256");
    const hash = sha256.update(password).digest("base64");
    return hash;
}

router.get("/profile", checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user;
    res.send(user);
})

router.post("/login", async (req, res) => {
    const user = await User.where({
        "email": req.body.email
    }).fetch({
        require: false
    });

    if (user && user.get("password") == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(user);
        res.send({
            accessToken
        })
    } else {
        res.send({
            "error": "Invalid login."
        })
    }

})

module.exports = router;
