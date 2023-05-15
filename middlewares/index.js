const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", "Please sign in first");
        res.redirect("/users/login")
    }
}

const jwt = require("jsonwebtoken")

const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        })
    } else {
        res.sendStatus(401)
    }
}

const checkIfAdmin = (req, res, next) => {
    if (req.session.user.role === 2) {
        next()
    } else {
        req.flash("error_messages", "Please contact an administrator to access this page.")
        res.redirect("back")
    }
}




module.exports = {
    checkIfAuthenticated,
    checkIfAdmin,
    checkIfAuthenticatedJWT
}