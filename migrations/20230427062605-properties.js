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
  return db.createTable("properties", {
    id: {
      type: "int",
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    name: {
      type: "string",
      length: 25
    }
  });
};

exports.down = function(db) {
  return db.dropTable("properties");
};

exports._meta = {
  "version": 1
};
