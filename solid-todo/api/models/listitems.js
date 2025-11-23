const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('listitems', {
    item_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: 'todolists',
      //   key: 'list_id'
      // }
    }
  }, {
    sequelize,
    tableName: 'listitems',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "listitems_pkey",
        unique: true,
        fields: [
          { name: "item_id" },
        ]
      },
    ]
  });
};
