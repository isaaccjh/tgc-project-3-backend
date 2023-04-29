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
  return db.addColumn("users", "profile_picture", {
    type: "string",
    length: 2048
  })
};

exports.down = function(db) {
  return removeColumn("users", "profile_picture");
};

exports._meta = {
  "version": 1
};
