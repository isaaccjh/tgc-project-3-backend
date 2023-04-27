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
  return db.createTable("variants", {
    id: {
      type: "int",
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    lure_id :{
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "variants_lure_fk",
        table: "lures",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT"
        },
        mapping: "id"
      }
    },
    colour_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "variants_colour_fk",
        table: "colours",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT"
        },
        mapping: "id"
      }
    },
    property_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "variants_property_fk",
        table: "properties",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT"
        },
        mapping: "id"
      }
    },
    stock: {
      type: "int",
      unsigned: true,
      notNull: true
    },
    cost: {
      type: "decimal",
      unsigned: true,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable("variants");
};

exports._meta = {
  "version": 1
};
