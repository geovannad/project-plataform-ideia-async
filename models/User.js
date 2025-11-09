module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING(100),
      cpf: DataTypes.STRING(12),
      email: DataTypes.STRING(100),
      created_date: DataTypes.DATE,
      password: DataTypes.STRING(50),
    },
    {
      tableName: '"User"',
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Idea, { foreignKey: "id_user" });
    User.hasMany(models.Response, { foreignKey: "id_user" });
    User.hasMany(models.Address, {
      foreignKey: "userId",
      as: "addresses",
    });
  };

  return User;
};
