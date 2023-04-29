const Handlebars = require("handlebars") 

Handlebars.registerHelper("getDisplayUsername", (user) => {
    const toDisplay = user.username ? user.username : user.email
    return toDisplay
});

module.exports = Handlebars.helpers;