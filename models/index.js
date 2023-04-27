const bookshelf = require("../bookshelf");

const Lure = bookshelf.model("Lure", {
    tableName: "lures"
});

const Serie = bookshelf.model("Serie", {
    tableName: "series"
})

module.exports = { Lure, Serie }