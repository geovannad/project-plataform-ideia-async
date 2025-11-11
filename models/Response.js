module.exports = (sequelize, DataTypes) => {
  const Response = sequelize.define("Response", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    id_ideia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Ideia',
        key: 'id',
      },
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    voted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'Response',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['id_user', 'id_ideia'],
        name: 'idx_user_ideia_unique',
      },
    ],
  });

  Response.associate = (models) => {
    Response.belongsTo(models.User, { foreignKey: 'id_user' });
    Response.belongsTo(models.Idea, { foreignKey: 'id_ideia' });
  };

  return Response;
}
