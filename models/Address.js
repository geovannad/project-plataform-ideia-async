const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const User = require("./User");

module.exports = (sequelize, DataTypes) => {
  const Address = db.define(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      street: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Rua não pode estar vazia",
          },
          len: {
            args: [5, 200],
            msg: "Rua deve ter entre 5 e 200 caracteres",
          },
        },
      },
      number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: {
            args: [0, 20],
            msg: "Número deve ter no máximo 20 caracteres",
          },
        },
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Cidade não pode estar vazia",
          },
          len: {
            args: [2, 100],
            msg: "Cidade deve ter entre 2 e 100 caracteres",
          },
        },
      },
    },
    {
      tableName: "addresses",
    }
  );

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Address;
};
