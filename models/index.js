const bookshelf = require("../bookshelf");

const Lure = bookshelf.model("Lure", {
    tableName: "lures",
    serie() {
        return this.belongsTo("Serie", "serie_id")
    }
});

const Serie = bookshelf.model("Serie", {
    tableName: "series",
    lure() {
        return this.hasMany("Lure")
    }
})

const Colour = bookshelf.model("Colour", {
    tableName: "colours"
})

const Property = bookshelf.model("Property", {
    tableName: "properties"
})

module.exports = { Lure, Serie }