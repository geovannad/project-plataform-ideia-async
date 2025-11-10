module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      cpf: {
        type: DataTypes.STRING(12),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // 👈 garante que não existam dois emails iguais
        validate: {
          isEmail: {
            msg: "Email inválido",
          },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false, // 👈 obrigatório para login
      },
      created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: '"User"',
      timestamps: false,
    }
  );

  // Associações
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
