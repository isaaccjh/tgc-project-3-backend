'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable("orders_items", {
    id: {
      type: "int",
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    quantity: {
      type: "int",
      unsigned: true,
      notNull: true
    },
    variant_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "orders_items_variant_fk",
        table: "variants",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT"
        }
      }
    },
    order_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "orders_items_order_fk",
        table: "orders",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT"
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable("orders_items");
};

exports._meta = {
  "version": 1
};
