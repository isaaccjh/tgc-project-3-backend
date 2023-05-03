const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const { User } = require("../models")

const { createRegistrationForm, createLoginForm, bootstrapField } = require("../forms");

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256");
    const hash = sha256.update(password).digest("base64");
    return hash;
}

router.get("/register", (req, res) => {
    const registerForm = createRegistrationForm();
    res.render("users/register", {
        "form": registerForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post("/register", (req, res) => {
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        "success": async (form) => {
            let { password, confirm_password, ...userData } = form.data;
            const user = new User({...userData, "password": getHashedPassword(form.data.password)});
            await user.save();
            req.flash("success_messages", "User signed up successfully!");
            res.redirect("/users/login")
        },
        "error": (form) => {
            res.render("users/register", {
                "form": form.toHTML(bootstrapField)
            })
        },
        "empty": (form) => {
            res.render("users/register", {
                "form": form.toHTML(bootstrapField)
            })
        }
    })
})

router.get("/login", (req, res) => {
    const loginForm = createLoginForm();

    res.render("users/login", {
        "form": loginForm.toHTML(bootstrapField)
    });

})

router.post("/login", async (req, res) => {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        "success": async (form) => {
            let user = await User.where({
                "email": form.data.email
            }).fetch({
                require: false
            })

            if (!user) {
                req.flash("error_messages", "We could not find an account with that email")
                res.redirect("/users/login")
            } else {
                if (user.get("password") === getHashedPassword(form.data.password)) {
                    req.session.user = {
                        id: user.get("id"),
                        email: user.get("email"),
                        username: user.get("username"),
                        role: user.get("role_id")
                    }
                    req.flash("success_messages", `Welcome back, ${user.get("username") === "" ? "User" : user.get("username")}!`)
                    res.redirect("/users/profile");
                    console.log(req.session.user);
                } else {
                    req.flash("error_messages", "Incorrect password")
                    res.redirect("/users/login")
                }
            }
        },
        "error": (form) => {
            req.flash("error_messages", "Error logging in, please try again.")
            res.render("users/login", {
                "form": form.toHTML(bootstrapField)
            })
        },
        "empty": (form) => {
            req.flash("error_messages", "Error logging in, please try again.")
            res.render("users/login", {
                "form": form.toHTML(bootstrapField)
            })
        }
    })
});

router.get("/profile", (req, res) => {
    const user = req.session.user;
    if (!user) {
        req.flash("error_messages", "Please login first!")
        res.redirect("/users/login")
    } else {
        res.render("users/profile", {
            "user": user
        })
    }
    
})

router.get("/logout", (req, res) => {
    req.session.user = null;
    req.flash("success_messages", "Logged out successfully.");
    res.redirect("/users/login");
    console.log(req.session.user)
})
module.exports = router;