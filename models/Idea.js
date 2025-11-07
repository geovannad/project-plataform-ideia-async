module.exports = (sequelize, DataTypes) => {
  const Idea = sequelize.define("Idea", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING(200),
    description: DataTypes.STRING(500),
    category: DataTypes.STRING(50),
    id_category: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    created_date: DataTypes.DATE
  }, {
    tableName: 'Ideia',
    timestamps: false
  });

  Idea.associate = (models) => {
    Idea.belongsTo(models.Category, { foreignKey: 'id_category' });
    Idea.belongsTo(models.User, { foreignKey: 'id_user' });
    Idea.hasMany(models.Response, { foreignKey: 'id_ideia' });
  };

  return Idea;
}
