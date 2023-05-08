const Handlebars = require("handlebars") 

Handlebars.registerHelper("getDisplayUsername", (user) => {
    const toDisplay = user.username ? user.username : user.email
    return toDisplay
});

Handlebars.registerHelper("toDollars", (price) => {
    const priceInDollars = (price / 100).toFixed(2);
    return priceInDollars;
})

Handlebars.registerHelper("upperCaseFirst", (string) => {
    let stringArr = [...string];
    let upper = stringArr[0].toUpperCase();
    stringArr[0] = upper;
    const newString = stringArr.join("");
    return newString;
})

Handlebars.registerHelper("checkDepth", (num) => {
    if (num !== 0) {
        return num
    } else {
        return "ALL"
    }
})


module.exports = Handlebars.helpers;