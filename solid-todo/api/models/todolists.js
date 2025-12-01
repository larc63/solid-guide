const { Model, DataTypes } = require('sequelize');

class TodoList extends Model {
  // You can add custom instance methods here
  async getItems() {
    // Assuming you have a ListItems model with associations
    return await this.getListitems();
  }
  
  // Custom class methods
  static async findByTitle(title) {
    return await this.findOne({ where: { title } });
  }
}

module.exports = (sequelize) => {
  TodoList.init({
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
    modelName: 'TodoList', // Important: add modelName
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
  
  return TodoList;
};