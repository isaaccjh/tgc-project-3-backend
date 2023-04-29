const express = require("express");
const router = express.Router();

const { User } = require("../models")

const { createRegistrationForm, createLoginForm, bootstrapField } = require("../forms");

router.get("/register", (req, res) => {
    const registerForm = createRegistrationForm();
    res.render("users/register", {
        "form": registerForm.toHTML(bootstrapField)
    })
})

router.post("/register", (req, res) => {
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        "success": async (form) => {
            let { confirm_password, ...userData } = form.data
            const user = new User(userData);
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

module.exports = router;