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
        unique: true,
        validate: {
          len: {
            args: [11, 11],
            msg: "O CPF deve ter 11 dígitos.",
          },
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, 
        validate: {
          isEmail: {
            msg: "Email inválido",
          },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false, 
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
  };

  return User;
};
