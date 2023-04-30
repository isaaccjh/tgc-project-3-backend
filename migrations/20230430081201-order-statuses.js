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
  return db.createTable("order_statuses", {
    id: {
      type: "int",
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    order_status: {
      type: "string",
      length: 20,
      notNull: true      
    } 
  });
};

exports.down = function(db) {
  return db.dropTables("order_statuses");
};

exports._meta = {
  "version": 1
};
