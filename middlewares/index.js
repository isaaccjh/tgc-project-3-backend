const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", "Please sign in first");
        res.redirect("/users/login")
    }
}

const checkIfAdmin = (req, res, next) => {
    if (req.session.user.rolei_id === 1) {
        next()
    } else {
        req.flash("error_messages", "Please contact an administrator to access this page.")
        res.redirect("back")
    }
}




module.exports = {
    checkIfAuthenticated,
    checkIfAdmin
}