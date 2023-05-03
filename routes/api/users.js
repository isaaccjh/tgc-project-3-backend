const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { User } = require("../../models")
const { checkIfAuthenticatedJWT } = require("../../middlewares")

    // const generateToken = (user) => {
    //     return jwt.sign({
    //         "username": user.get("username"),
    //         "id": user.get("id"),
    //         "email": user.get("email")
    //     }, process.env.TOKEN_SECRET, {
    //         expiresIn: "1h"
    //     });
    // }

const generateToken = (user, secret, expiresIn) => {
    return jwt.sign({
        "id": user.id,
        "email": user.email
    }, secret, {
        expiresIn
    });
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256");
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
        let accessToken = generateToken(user.toJSON(), process.env.TOKEN_SECRET, "15m");
        let refreshToken = generateToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, "7d")
        res.send({
            accessToken, refreshToken
        })
    } else {
        res.send({
            "error": "Invalid login."
        })
    }
})

router.post("/refresh", async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401)
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403);
        }

        let accessToken = generateToken(user, process.env.TOKEN_SECRET, "15m");
        res.send({
            accessToken
        })
    })
})

module.exports = router;
