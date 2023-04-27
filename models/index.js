const bookshelf = require("../bookshelf");

const Lure = bookshelf.model("Lure", {
    tableName: "lures",
    serie() {
        return this.belongsTo("Serie", "serie_id")
    },
    variant() {
        return this.belongsToMany("Variant")
    }
});

const Serie = bookshelf.model("Serie", {
    tableName: "series",
    lure() {
        return this.hasMany("Lure")
    }
})

const Colour = bookshelf.model("Colour", {
    tableName: "colours",
    variant() {
        return this.belongsToMany("Variant")
    }
})

const Property = bookshelf.model("Property", {
    tableName: "properties",
    variant() {
        return this.belongsToMany("Variant")
    }
})

const Variant = bookshelf.model("Variant", {
    tableName: "variants",
    lure() {
        return this.belongsToMany("Lure")
    },
    colour() {
        return this.belongsToMany("Colour")
    },
    property() {
        return this.belongsToMany("Property")
    }
})

module.exports = { Lure, Serie, Colour, Property, Variant }