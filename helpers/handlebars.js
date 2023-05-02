const Handlebars = require("handlebars") 

Handlebars.registerHelper("getDisplayUsername", (user) => {
    const toDisplay = user.username ? user.username : user.email
    return toDisplay
});

Handlebars.registerHelper("toDollars", (price) => {
    const priceInDollars = price / 100;
    return priceInDollars
})

module.exports = Handlebars.helpers;