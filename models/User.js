const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Título não pode estar vazio'
      },
      len: {
        args: [2, 100],
        msg: 'Título deve ter entre 2 e 100 caracteres'
      }
    }
  },
  occupation: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'Descrição não pode estar vazia'
      },
      len: {
        args: [2, 150],
        msg: 'Descrição deve ter no máximo 150 caracteres'
      }
    }
  },
  newsletter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, {
  tableName: 'users',
  indexes: [
    {
      fields: ['name'] // Índice para busca por nome
    }
  ]
});

module.exports = User;