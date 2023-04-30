'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("orders", {
    id: {
      type: "int",
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    user_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "orders_user_fk",
        table: "users",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT"
        }
      }
    },
    order_status_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "orders_order_status_fk",
        table: "order_statuses",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT"
        }
      }
    },
    payment_type: {
      type: "string",
      length: 50,
      notNull: true
    },
    total_cost: {
      type: "int",
      unsigned: true,
      notNull: true,
    },
    order_date: {
      type: "datetime",
      notNull: true
    },
    shipping_country: {
      type: "string",
      length: 56,
      notNull: true
    },
    shipping_postal: {
      type: "string",
      length: 15,
      notNull: true
    },
    shipping_address_line_1: {
      type: "string",
      length: 100,
      notNull: true
    },
    shipping_address_line_2: {
      type: "string",
      length: 100,
      notNull: false
    },
    billing_country: {
      type: "string",
      length: 45,
      notNull: false
    },
    billing_postal: {
      type: "string",
      length: 15,
      notNull: false
    },
    billing_address_line_1: {
      type: "string",
      length: 100,
      notNull: false
    },
    billing_address_line_2: {
      type: "string",
      length: 100,
      notNull: false
    }
  });
};

exports.down = function (db) {
  return db.dropTabnle("orders");
};

exports._meta = {
  "version": 1
};
