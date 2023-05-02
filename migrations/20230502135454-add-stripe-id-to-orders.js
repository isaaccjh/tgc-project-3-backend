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
  return db.addColumn("orders", "stripe_id", {
      type: "string",
      length: 2048,
      notNull: true
  });
};

exports.down = function(db) {
  return db.removeColumn("orders", "stripe_id");
};

exports._meta = {
  "version": 1
};
