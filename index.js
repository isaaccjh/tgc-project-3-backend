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
    secret: "keyboard cat",
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
    users: require("./routes/users")
}

app.use(csrf());
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
        res.locals.csrfToken = req.csrfToken();
        next();
    })

    app.use("/lures", routes.lures);
    app.use("/users", routes.users);
}

main();


app.listen(3000 || process.env.PORT, () => {
    console.log("Server has started");
})