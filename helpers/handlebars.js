const Handlebars = require("handlebars") 

Handlebars.registerHelper("getDisplayUsername", (user) => {
    const toDisplay = user.username ? user.username : user.email
    return toDisplay
});

Handlebars.registerHelper("toDollars", (price) => {
    const priceInDollars = price / 100;
    return priceInDollars;
})

Handlebars.registerHelper("upperCaseFirst", (string) => {
    let stringArr = [...string];
    let upper = stringArr[0].toUpperCase();
    stringArr[0] = upper;
    console.log(stringArr)
    const newString = stringArr.join("");
    return newString;
})

module.exports = Handlebars.helpers;