const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const csrf = require("csurf")
const cors = require("cors")
require("dotenv").config();

const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);

let app = express();

app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(cors());

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

const api = {
    lures: require("./routes/api/lures"),
    users: require("./routes/api/users"),
    carts: require("./routes/api/carts")
}

// app.use(csrf());
const csurfInstance = csrf();
app.use(function (req, res, next) {
    console.log("checking for csrf exclusion")
    if (req.url === "/checkout/process_payment" || req.url.slice(0, 5) === "/api/") {
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

async function main() {
    app.use(function (req, res, next) {
        res.locals.user = req.session.user;
        console.log(req.session.user);
        next();
    })

    app.use((req, res, next) => {
        if (req.csrfToken) {
            res.locals.csrfToken = req.csrfToken();
        }
        next();
    })

    app.get("/", (req, res) => {
        if (req.session.user) {
            res.redirect("/lures")
        } else {
            res.redirect("/users/login")
        }
    })

    app.use("/lures", routes.lures);
    app.use("/users", routes.users);
    app.use("/cloudinary", routes.cloudinary);
    app.use("/cart", routes.shoppingCart);
    app.use("/checkout", express.json(), routes.checkout);
    app.use("/orders", routes.orders);
    app.use("/api/lures", express.json(), api.lures);
    app.use("/api/users", express.json(), api.users);
    app.use("/api/carts", express.json(), api.carts);
}

main();


app.listen(3000 || process.env.PORT, () => {
    console.log("Server has started");
})