const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", "Please sign in first");
        res.redirect("/users/login")
    }
}

module.exports = {
    checkIfAuthenticated
}