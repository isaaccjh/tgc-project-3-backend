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
  return db.createTable("lures", {
    id: {
      type: "int",
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: "string",
      length: 100,
      notNull: true
    },
    description: {
      type: "text",
      notNull: true
    },
    hook: {
      type: "string",
      length: 5,
      notNull: true
    },
    type: {
      type: "string",
      length: 20,
      notNull: true
    },
    size: {
      type: "decimal",
      unsigned: true,
      notNull: true
    },
    weight: {
      type: "decimal",
      unsigned: true,
      notNull: true
    },
    depth: {
      type: "decimal",
      unsigned: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable("lures");
};

exports._meta = {
  "version": 1
};
