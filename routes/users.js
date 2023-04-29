const express = require("express");
const router = express.Router();

const { User } = require("../models")

const { createRegistrationForm, bootstrapField } = require("../forms");

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
            const user = new User(form.data);
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

module.exports = router;