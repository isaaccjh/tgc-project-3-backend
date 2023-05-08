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
  return db.runSql("INSERT INTO colours (name) VALUES ('ABSINTHE'),('AYU'),('BIG WILLY'),('BLACK JACK'),('BLACK MAGIC'),('BLACK SILVER'),('BLOODNUT'),('BOGAN MULLET'),('BRONZED CHERRY'),('CAJUN COWBOY'),('CHARTREUSE SHAD'),('CHARTREUSE TIGER'),('CHOCOLATE ROSE'),('CHROME PINK'),('COOKED BONITO'),('COLA'),('DARK ALE'),('DORADO'),('FIRE TIGER'),('FISH SLAYER'),('FLYING BEAR'),('FLYING FISH'),('FUSILIER'),('GHOST'),('GHOST CATFISH'),('GHOST WHITING'),('GIANT TIGER'),('GOLD CARP'),('GOLD FUSILIER'),('GOLD MEMBER'),('GOLD SCALE'),('GOLD SPOTTED DOG'),('GOLD UV'),('GOLDEN BASS'),('GOLDEN YAKKA'),('GREEN BASS'),('GREEN FLYING FISH'),('GREEN GOLD'),('GREEN SCALE'),('GREEN TIGER'),('GRIFFIN'),('HANG OVER'),('HERRING'),('JOLLY BEE'),('KEMBONG'),('KEMBONG GREEN'),('LARGE MOUTH BASS'),('LIME MINNOW'),('LOST MINNOW'),('LUM CLEAR'),('MARDI GRAS'),('MEDIUM RARE'),('MIDNIGHT MULLET'),('MIDNIGHT STORM'),('MOJITO'),('MURRAY COD'),('MUTANT GOLDFISH'),('OIKAWA'),('OLIVE GUPPY'),('ORANGE BELLY TROUT'),('ORANGE CRAW'),('ORANGE FIN ALBINO'),('ORANGE GILL'),('ORANDA GOLDFISH'),('PACIFIC TIGER'),('PEARL'),('PILCHARD SILVER'),('PINK BITS'),('PINK EYE'),('PINK GHOST'),('PINK LUMO'),('PINK SUNSET'),('POP CORN'),('PRETTY BOY'),('PRISM ALGER'),('PROBLEM CHILD'),('PURPLE DEMON'),('PURPLE MADNESS'),('PURPLE RAIN'),('RAINBOW TROUT'),('REALISTIC ANCHOVY'),('REALISTIC BLUE SARDINE'),('REALISTIC GOLDEN DORADO'),('REALISTIC GOLDEN MULLET'),('REALISTIC KEMBONG'),('REALISTIC LARGEMOUTH BASS'),('REALISTIC MURRAY COD'),('REALISTIC MULLET'),('REALISTIC PINK SARDINE'),('REALISTIC PURPLE SARDINE'),('REALISTIC SCISSORTAIL FUSILIER'),('REALISTIC SILVER SIDE'),('REALISTIC YELLOW MAGIC'),('RED BARON'),('RED BOLT'),('RED CHEEK'),('RED DEVIL'),('RED FIN'),('RED HEAD'),('RED LOBSTER'),('RED MULLET'),('REDFIN PERCH'),('SAURY'),('SARDINE'),('SCUM DOG'),('SEBARAU'),('SILVER AYU'),('SILVER BULLET'),('SILVER HERRING'),('SILVER LUMO'),('SILVER PERCH'),('SILVERY GREEN'),('SLIMEY MACKEREL'),('SPACE MULLET'),('SPOTTED DOG'),('STRIPE PERCH'),('STUNNED MULLET'),('SUN RISE'),('SUNDANCE'),('SUNDOWN'),('SUNSET'),('SUPER SHAD'),('TANGERINE TIGER'),('TEM'),('TEMMY'),('THOR WHITE LEG'),('TIGER FISH'),('TIGER PERCH'),('TIGER PIT'),('UV GREEN'),('VOGUE'),('WIDE SPECTRUM'),('WHITE GILL'),('YELLOW FIN'),('YELLOW TAIL'),('YOLO')")
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};