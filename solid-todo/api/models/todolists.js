const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('todolists', {
    list_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'todolists',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "todolists_pkey",
        unique: true,
        fields: [
          { name: "list_id" },
        ]
      },
    ]
  });
};
