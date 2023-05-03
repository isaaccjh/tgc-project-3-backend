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
        return this.hasMany("Variant")
    }
})

const Property = bookshelf.model("Property", {
    tableName: "properties",
    variant() {
        return this.hasMany("Variant")
    }
})

const Variant = bookshelf.model("Variant", {
    tableName: "variants",
    lure() {
        return this.belongsTo("Lure")
    },
    colour() {
        return this.belongsTo("Colour")
    },
    property() {
        return this.belongsTo("Property")
    },
    order_item() {
        return this.hasMany("OrderItem")
    }
})

const User = bookshelf.model("User", {
    tableName: "users",
    order() {
        return this.hasMany("Order")
    },
    role() {
        return this.belongsTo("Role")
    }
});

const CartItem = bookshelf.model("CartItem", {
    tableName: "cart_items",
    variant() {
        return this.belongsTo("Variant")
    },
    lure() {
        return this.belongsTo("Lure")
    }
})

const OrderStatus = bookshelf.model("OrderStatus", {
    tableName: "order_statuses",
    order() {
        return this.hasMany("Order")
    }
})

const Order = bookshelf.model("Order", {
    tableName: "orders",
    order_status() {
        return this.belongsTo("OrderStatus")
    },
    user() {
        return this.belongsTo("User")
    },
    order_item() {
        return this.hasMany("OrderItem")
    }
})

const OrderItem = bookshelf.model("OrderItem", {
    tableName: "orders_items",
    order() {
        return this.belongsTo("Order")
    },
    variant() {
        return this.belongsTo("Variant")
    }
})

const Role = bookshelf.model("Role", {
    tableName: "roles",
    user() {
        return this.hasMany("User")
    }
})

const BlacklistedToken = bookshelf.model("BlacklistedToken", {
    tableName: "blacklisted_tokens"
})

module.exports = { 
    Lure, 
    Serie, 
    Colour, 
    Property, 
    Variant, 
    User, 
    CartItem,
    Order,
    OrderStatus,
    Role,
    OrderItem,
    BlacklistedToken
 }