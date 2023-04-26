const bookshelf = require("../bookshelf");

const Lure = bookshelf.model("Lure", {
    tableName: "lures"
});


module.exports = { Lure }