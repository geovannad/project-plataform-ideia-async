module.exports = (sequelize, DataTypes) => {
  const Response = sequelize.define("Response", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: DataTypes.INTEGER,
    id_ideia: DataTypes.INTEGER,
    created_date: DataTypes.DATE,
    voted: DataTypes.BOOLEAN
  }, {
    tableName: 'Response',
    timestamps: false
  });

  Response.associate = (models) => {
    Response.belongsTo(models.User, { foreignKey: 'id_user' });
    Response.belongsTo(models.Idea, { foreignKey: 'id_ideia' });
  };

  return Response;
}
