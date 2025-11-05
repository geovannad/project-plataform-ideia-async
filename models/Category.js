module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'category',
    timestamps: false
  });

  Category.associate = (models) => {
    Category.hasMany(models.Idea, { foreignKey: 'id_category' });
  };

  return Category;
}
