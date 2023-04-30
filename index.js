const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const csrf = require("csurf")
require("dotenv").config();

const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);

let app = express();

app.set("view engine", "hbs");
app.use(express.static("public"));

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

const hbsHelpers = require("./helpers/handlebars");

hbs.registerHelper(hbsHelpers);

app.use(express.urlencoded({
    extended: false
}));

app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});



const routes = {
    lures: require("./routes/lures"),
    users: require("./routes/users"),
    cloudinary: require("./routes/cloudinary"),
    shoppingCart: require("./routes/shoppingCart"),
    checkout: require("./routes/checkout"),
    orders: require("./routes/orders")
}

// app.use(csrf());
const csurfInstance = csrf();
app.use(function (req, res, next) {
    console.log("checking for csrf exclusion")
    if (req.url === "/checkout/process_payment") {
        return next()
    }
    csurfInstance(req, res, next);
})

app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash("error_messages", "The form has expired. Please try again");
        res.redirect("back");
    } else {
        next();
    }
})

async function main () {
    app.use(function (req, res, next) {
        res.locals.user = req.session.user;
        next();
    })

    app.use((req, res, next) => {
        if (req.csrfToken) {
            res.locals.csrfToken = req.csrfToken();
        }
        next();
    })

    app.use("/lures", routes.lures);
    app.use("/users", routes.users);
    app.use("/cloudinary", routes.cloudinary);
    app.use("/cart", routes.shoppingCart);
    app.use("/checkout", routes.checkout);
    app.use("/orders", routes.orders)
}

main();


app.listen(3000 || process.env.PORT, () => {
    console.log("Server has started");
})