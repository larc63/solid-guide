var DataTypes = require("sequelize").DataTypes;
var _listitems = require("./listitems");
var _todolists = require("./todolists");

function initModels(sequelize) {
  var listitems = _listitems(sequelize, DataTypes);
  var todolists = _todolists(sequelize, DataTypes);

  listitems.belongsTo(todolists, { as: "list", foreignKey: "list_id"});
  todolists.hasMany(listitems, { as: "listitems", foreignKey: "list_id"});

  return {
    listitems,
    todolists,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
