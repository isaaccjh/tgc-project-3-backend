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
  return db.addColumn("users", "role_id", {
    type: "int",
    unsigned: true,
    notNull: true,
    defaultValue: 1,
    foreignKey: {
      "name": "users_role_fk",
      "table": "roles",
      "mapping": "id",
      "rules": {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT"
      }
    }
  });
};

exports.down = function(db) {
  return db.removeColumn("users", "role_id");
};

exports._meta = {
  "version": 1
};
