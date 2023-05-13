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
  return db.runSql("INSERT into order_statuses (order_status) values ('Pending'), ('Processing'), ('Shipping'), ('Delivered'), ('Refunded')");
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
