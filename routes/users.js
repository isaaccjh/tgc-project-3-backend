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
                if (user.get("password") === form.data.password) {
                    req.session.user = {
                        id: user.get("id"),
                        email: user.get("email"),
                        username: user.get("username")
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