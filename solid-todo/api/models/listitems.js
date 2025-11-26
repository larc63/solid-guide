const { Model, DataTypes } = require('sequelize');

class ListItem extends Model {
  // Custom instance methods
  async toggleState() {
    this.done = !this.done;
    return await this.save();
  }
  
  async moveToRank(newRank) {
    this.rank = newRank;
    return await this.save();
  }
  
  // Custom static methods
  static async getCompletedItems(listId) {
    return await this.findAll({
      where: { 
        list_id: listId,
        done: true 
      },
      order: [['rank', 'ASC']]
    });
  }
  
  static async getMaxRank(listId) {
    return await this.max('rank', {
      where: { list_id: listId }
    }) || 0;
  }
}

module.exports = (sequelize) => {
  ListItem.init({
    item_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false // unchecked/incomplete by default
    },
    list_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'listitems',
    schema: 'public',
    modelName: 'ListItem',
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
  
  return ListItem;
};